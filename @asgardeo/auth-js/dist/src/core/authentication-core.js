var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { AUTHORIZATION_ENDPOINT, FetchCredentialTypes, OIDC_SCOPE, OP_CONFIG_INITIATED, SESSION_STATE, SIGN_OUT_SUCCESS_PARAM, STATE } from "../constants";
import { AsgardeoAuthException } from "../exception";
import { AuthenticationHelper, CryptoHelper } from "../helpers";
import { AuthenticationUtils } from "../utils";
export class AuthenticationCore {
    constructor(dataLayer, cryptoUtils) {
        this._cryptoUtils = cryptoUtils;
        this._cryptoHelper = new CryptoHelper(cryptoUtils);
        this._authenticationHelper = new AuthenticationHelper(dataLayer, this._cryptoHelper);
        this._dataLayer = dataLayer;
        this._config = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getConfigData(); });
        this._oidcProviderMetaData = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getOIDCProviderMetaData(); });
    }
    getAuthorizationURL(config, userID) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const authorizeEndpoint = (yield this._dataLayer.getOIDCProviderMetaDataParameter(AUTHORIZATION_ENDPOINT));
            const configData = yield this._config();
            if (!authorizeEndpoint || authorizeEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-GAU-NF01", "No authorization endpoint found.", "No authorization endpoint was found in the OIDC provider meta data from the well-known endpoint " +
                    "or the authorization endpoint passed to the SDK is empty.");
            }
            const authorizeRequest = new URL(authorizeEndpoint);
            const authorizeRequestParams = new Map();
            authorizeRequestParams.set("response_type", "code");
            authorizeRequestParams.set("client_id", configData.clientID);
            let scope = OIDC_SCOPE;
            if (configData.scope && configData.scope.length > 0) {
                if (!configData.scope.includes(OIDC_SCOPE)) {
                    configData.scope.push(OIDC_SCOPE);
                }
                scope = configData.scope.join(" ");
            }
            authorizeRequestParams.set("scope", scope);
            authorizeRequestParams.set("redirect_uri", configData.signInRedirectURL);
            if (configData.responseMode) {
                authorizeRequestParams.set("response_mode", configData.responseMode);
            }
            const pkceKey = yield this._authenticationHelper.generatePKCEKey(userID);
            if (configData.enablePKCE) {
                const codeVerifier = (_a = this._cryptoHelper) === null || _a === void 0 ? void 0 : _a.getCodeVerifier();
                const codeChallenge = (_b = this._cryptoHelper) === null || _b === void 0 ? void 0 : _b.getCodeChallenge(codeVerifier);
                yield this._dataLayer.setTemporaryDataParameter(pkceKey, codeVerifier, userID);
                authorizeRequestParams.set("code_challenge_method", "S256");
                authorizeRequestParams.set("code_challenge", codeChallenge);
            }
            if (configData.prompt) {
                authorizeRequestParams.set("prompt", configData.prompt);
            }
            const customParams = config;
            if (customParams) {
                for (const [key, value] of Object.entries(customParams)) {
                    if (key != "" && value != "" && key !== STATE) {
                        const snakeCasedKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                        authorizeRequestParams.set(snakeCasedKey, value.toString());
                    }
                }
            }
            authorizeRequestParams.set(STATE, AuthenticationUtils.generateStateParamForRequestCorrelation(pkceKey, customParams ? (_c = customParams[STATE]) === null || _c === void 0 ? void 0 : _c.toString() : ""));
            for (const [key, value] of authorizeRequestParams.entries()) {
                authorizeRequest.searchParams.append(key, value);
            }
            return authorizeRequest.toString();
        });
    }
    requestAccessToken(authorizationCode, sessionState, state, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndpoint = (yield this._oidcProviderMetaData()).token_endpoint;
            const configData = yield this._config();
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT1-NF01", "Token endpoint not found.", "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the token endpoint passed to the SDK is empty.");
            }
            sessionState && (yield this._dataLayer.setSessionDataParameter(SESSION_STATE, sessionState, userID));
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
                body.push(`client_secret=${configData.clientSecret}`);
            }
            const code = authorizationCode;
            body.push(`code=${code}`);
            body.push("grant_type=authorization_code");
            body.push(`redirect_uri=${configData.signInRedirectURL}`);
            if (configData.enablePKCE) {
                body.push(`code_verifier=${yield this._dataLayer.getTemporaryDataParameter(AuthenticationUtils.extractPKCEKeyFromStateParam(state), userID)}`);
                yield this._dataLayer.removeTemporaryDataParameter(AuthenticationUtils.extractPKCEKeyFromStateParam(state), userID);
            }
            let tokenResponse;
            try {
                tokenResponse = yield fetch(tokenEndpoint, {
                    body: body.join("&"),
                    credentials: configData.sendCookiesInRequests
                        ? FetchCredentialTypes.Include
                        : FetchCredentialTypes.SameOrigin,
                    headers: new Headers(AuthenticationUtils.getTokenRequestHeaders()),
                    method: "POST"
                });
            }
            catch (error) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT1-NE02", "Requesting access token failed", error !== null && error !== void 0 ? error : "The request to get the access token from the server failed.");
            }
            if (!tokenResponse.ok) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT1-HE03", `Requesting access token failed with ${tokenResponse.statusText}`, yield tokenResponse.json());
            }
            return yield this._authenticationHelper.handleTokenResponse(tokenResponse, userID);
        });
    }
    refreshAccessToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenEndpoint = (yield this._oidcProviderMetaData()).token_endpoint;
            const configData = yield this._config();
            const sessionData = yield this._dataLayer.getSessionData(userID);
            if (!sessionData.refresh_token) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT2-NF01", "No refresh token found.", "There was no refresh token found. Asgardeo doesn't return a " +
                    "refresh token if the refresh token grant is not enabled.");
            }
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT2-NF02", "No refresh token endpoint found.", "No refresh token endpoint was in the OIDC provider meta data returned by the well-known " +
                    "endpoint or the refresh token endpoint passed to the SDK is empty.");
            }
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            body.push(`refresh_token=${sessionData.refresh_token}`);
            body.push("grant_type=refresh_token");
            if (configData.clientSecret && configData.clientSecret.trim().length > 0) {
                body.push(`client_secret=${configData.clientSecret}`);
            }
            let tokenResponse;
            try {
                tokenResponse = yield fetch(tokenEndpoint, {
                    body: body.join("&"),
                    credentials: configData.sendCookiesInRequests
                        ? FetchCredentialTypes.Include
                        : FetchCredentialTypes.SameOrigin,
                    headers: new Headers(AuthenticationUtils.getTokenRequestHeaders()),
                    method: "POST"
                });
            }
            catch (error) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT2-NR03", "Refresh access token request failed.", error !== null && error !== void 0 ? error : "The request to refresh the access token failed.");
            }
            if (!tokenResponse.ok) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT2-HE04", `Refreshing access token failed with ${tokenResponse.statusText}`, yield tokenResponse.json());
            }
            return this._authenticationHelper.handleTokenResponse(tokenResponse, userID);
        });
    }
    revokeAccessToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const revokeTokenEndpoint = (yield this._oidcProviderMetaData()).revocation_endpoint;
            const configData = yield this._config();
            if (!revokeTokenEndpoint || revokeTokenEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT3-NF01", "No revoke access token endpoint found.", "No revoke access token endpoint was found in the OIDC provider meta data returned by " +
                    "the well-known endpoint or the revoke access token endpoint passed to the SDK is empty.");
            }
            const body = [];
            body.push(`client_id=${configData.clientID}`);
            body.push(`token=${(yield this._dataLayer.getSessionData(userID)).access_token}`);
            body.push("token_type_hint=access_token");
            let response;
            try {
                response = yield fetch(revokeTokenEndpoint, {
                    body: body.join("&"),
                    credentials: configData.sendCookiesInRequests
                        ? FetchCredentialTypes.Include
                        : FetchCredentialTypes.SameOrigin,
                    headers: new Headers(AuthenticationUtils.getTokenRequestHeaders()),
                    method: "POST"
                });
            }
            catch (error) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT3-NE02", "The request to revoke access token failed.", error !== null && error !== void 0 ? error : "The request sent to revoke the access token failed.");
            }
            if (response.status !== 200 || !response.ok) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RAT3-HE03", `Invalid response status received for revoke access token request (${response.statusText}).`, yield response.json());
            }
            this._authenticationHelper.clearUserSessionData(userID);
            return Promise.resolve(response);
        });
    }
    requestCustomGrant(customGrantParams, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetadata = yield this._oidcProviderMetaData();
            const configData = yield this._config();
            let tokenEndpoint;
            if (customGrantParams.tokenEndpoint && customGrantParams.tokenEndpoint.trim().length !== 0) {
                tokenEndpoint = customGrantParams.tokenEndpoint;
            }
            else {
                tokenEndpoint = oidcProviderMetadata.token_endpoint;
            }
            if (!tokenEndpoint || tokenEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RCG-NF01", "Token endpoint not found.", "No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the token endpoint passed to the SDK is empty.");
            }
            const data = yield Promise.all(Object.entries(customGrantParams.data).map(([key, value]) => __awaiter(this, void 0, void 0, function* () {
                const newValue = yield this._authenticationHelper.replaceCustomGrantTemplateTags(value, userID);
                return `${key}=${newValue}`;
            })));
            let requestHeaders = Object.assign({}, AuthenticationUtils.getTokenRequestHeaders());
            if (customGrantParams.attachToken) {
                requestHeaders = Object.assign(Object.assign({}, requestHeaders), { Authorization: `Bearer ${(yield this._dataLayer.getSessionData(userID)).access_token}` });
            }
            const requestConfig = {
                body: data.join("&"),
                credentials: configData.sendCookiesInRequests
                    ? FetchCredentialTypes.Include
                    : FetchCredentialTypes.SameOrigin,
                headers: new Headers(requestHeaders),
                method: "POST"
            };
            let response;
            try {
                response = yield fetch(tokenEndpoint, requestConfig);
            }
            catch (error) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RCG-NE02", "The custom grant request failed.", error !== null && error !== void 0 ? error : "The request sent to get the custom grant failed.");
            }
            if (response.status !== 200 || !response.ok) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-RCG-HE03", `Invalid response status received for the custom grant request. (${response.statusText})`, yield response.json());
            }
            if (customGrantParams.returnsSession) {
                return this._authenticationHelper.handleTokenResponse(response, userID);
            }
            else {
                return Promise.resolve(yield response.json());
            }
        });
    }
    getBasicUserInfo(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionData = yield this._dataLayer.getSessionData(userID);
            const authenticatedUser = this._authenticationHelper.getAuthenticatedUserInfo(sessionData === null || sessionData === void 0 ? void 0 : sessionData.id_token);
            let basicUserInfo = {
                allowedScopes: sessionData.scope,
                sessionState: sessionData.session_state
            };
            Object.keys(authenticatedUser).forEach((key) => {
                if (authenticatedUser[key] === undefined ||
                    authenticatedUser[key] === "" ||
                    authenticatedUser[key] === null) {
                    delete authenticatedUser[key];
                }
            });
            basicUserInfo = Object.assign(Object.assign({}, basicUserInfo), authenticatedUser);
            return basicUserInfo;
        });
    }
    getDecodedIDToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const idToken = (yield this._dataLayer.getSessionData(userID)).id_token;
            const payload = this._cryptoHelper.decodeIDToken(idToken);
            return payload;
        });
    }
    getCryptoHelper() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._cryptoHelper;
        });
    }
    getIDToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._dataLayer.getSessionData(userID)).id_token;
        });
    }
    getOIDCProviderMetaData(forceInit) {
        return __awaiter(this, void 0, void 0, function* () {
            const configData = yield this._config();
            if (!forceInit && (yield this._dataLayer.getTemporaryDataParameter(OP_CONFIG_INITIATED))) {
                return Promise.resolve();
            }
            const wellKnownEndpoint = configData.wellKnownEndpoint;
            if (wellKnownEndpoint) {
                let response;
                try {
                    response = yield fetch(wellKnownEndpoint);
                    if (response.status !== 200 || !response.ok) {
                        throw new Error();
                    }
                }
                catch (_a) {
                    throw new AsgardeoAuthException("JS-AUTH_CORE-GOPMD-HE01", "Invalid well-known response", "The well known endpoint response has been failed with an error.");
                }
                yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpoints(yield response.json()));
                yield this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);
                return Promise.resolve();
            }
            else if (configData.baseUrl) {
                try {
                    yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsByBaseURL());
                }
                catch (error) {
                    throw new AsgardeoAuthException("JS-AUTH_CORE-GOPMD-IV02", "Resolving endpoints failed.", error !== null && error !== void 0 ? error : "Resolving endpoints by base url failed.");
                }
                yield this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);
                return Promise.resolve();
            }
            else {
                try {
                    yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsExplicitly());
                }
                catch (error) {
                    throw new AsgardeoAuthException("JS-AUTH_CORE-GOPMD-IV03", "Resolving endpoints failed.", error !== null && error !== void 0 ? error : "Resolving endpoints by explicitly failed.");
                }
                yield this._dataLayer.setTemporaryDataParameter(OP_CONFIG_INITIATED, true);
                return Promise.resolve();
            }
        });
    }
    getOIDCServiceEndpoints() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = yield this._oidcProviderMetaData();
            return {
                authorizationEndpoint: (_a = oidcProviderMetaData.authorization_endpoint) !== null && _a !== void 0 ? _a : "",
                checkSessionIframe: (_b = oidcProviderMetaData.check_session_iframe) !== null && _b !== void 0 ? _b : "",
                endSessionEndpoint: (_c = oidcProviderMetaData.end_session_endpoint) !== null && _c !== void 0 ? _c : "",
                introspectionEndpoint: (_d = oidcProviderMetaData.introspection_endpoint) !== null && _d !== void 0 ? _d : "",
                issuer: (_e = oidcProviderMetaData.issuer) !== null && _e !== void 0 ? _e : "",
                jwksUri: (_f = oidcProviderMetaData.jwks_uri) !== null && _f !== void 0 ? _f : "",
                registrationEndpoint: (_g = oidcProviderMetaData.registration_endpoint) !== null && _g !== void 0 ? _g : "",
                revocationEndpoint: (_h = oidcProviderMetaData.revocation_endpoint) !== null && _h !== void 0 ? _h : "",
                tokenEndpoint: (_j = oidcProviderMetaData.token_endpoint) !== null && _j !== void 0 ? _j : "",
                userinfoEndpoint: (_k = oidcProviderMetaData.userinfo_endpoint) !== null && _k !== void 0 ? _k : ""
            };
        });
    }
    getSignOutURL(userID) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const logoutEndpoint = (_a = (yield this._oidcProviderMetaData())) === null || _a === void 0 ? void 0 : _a.end_session_endpoint;
            const configData = yield this._config();
            if (!logoutEndpoint || logoutEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-GSOU-NF01", "Sign-out endpoint not found.", "No sign-out endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the sign-out endpoint passed to the SDK is empty.");
            }
            const idToken = (_b = (yield this._dataLayer.getSessionData(userID))) === null || _b === void 0 ? void 0 : _b.id_token;
            if (!idToken || idToken.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-GSOU-NF02", "ID token not found.", "No ID token could be found. Either the session information is lost or you have not signed in.");
            }
            const callbackURL = (_c = configData === null || configData === void 0 ? void 0 : configData.signOutRedirectURL) !== null && _c !== void 0 ? _c : configData === null || configData === void 0 ? void 0 : configData.signInRedirectURL;
            if (!callbackURL || callbackURL.trim().length === 0) {
                throw new AsgardeoAuthException("JS-AUTH_CORE-GSOU-NF03", "No sign-out redirect URL found.", "The sign-out redirect URL cannot be found or the URL passed to the SDK is empty. " +
                    "No sign-in redirect URL has been found either. ");
            }
            const logoutCallback = `${logoutEndpoint}?` +
                `id_token_hint=${idToken}` +
                `&post_logout_redirect_uri=${callbackURL}&state=` +
                SIGN_OUT_SUCCESS_PARAM;
            return logoutCallback;
        });
    }
    clearUserSessionData(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._authenticationHelper.clearUserSessionData(userID);
        });
    }
    getAccessToken(userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield this._dataLayer.getSessionData(userID))) === null || _a === void 0 ? void 0 : _a.access_token;
        });
    }
    isAuthenticated(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.getAccessToken(userID));
        });
    }
    getPKCECode(state, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._dataLayer.getTemporaryDataParameter(AuthenticationUtils.extractPKCEKeyFromStateParam(state), userID));
        });
    }
    setPKCECode(pkce, state, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._dataLayer.setTemporaryDataParameter(AuthenticationUtils.extractPKCEKeyFromStateParam(state), pkce, userID);
        });
    }
    updateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._dataLayer.setConfigData(config);
            yield this.getOIDCProviderMetaData(true);
        });
    }
}
//# sourceMappingURL=authentication-core.js.map