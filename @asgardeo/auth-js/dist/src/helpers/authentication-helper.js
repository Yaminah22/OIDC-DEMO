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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AUTHORIZATION_ENDPOINT, CLIENT_ID_TAG, CLIENT_SECRET_TAG, END_SESSION_ENDPOINT, FetchCredentialTypes, ISSUER, JWKS_ENDPOINT, OIDC_SCOPE, OIDC_SESSION_IFRAME_ENDPOINT, PKCE_CODE_VERIFIER, PKCE_SEPARATOR, REVOKE_TOKEN_ENDPOINT, SCOPE_TAG, SERVICE_RESOURCES, TOKEN_ENDPOINT, TOKEN_TAG, USERINFO_ENDPOINT, USERNAME_TAG } from "../constants";
import { AsgardeoAuthException } from "../exception";
import { AuthenticationUtils } from "../utils";
export class AuthenticationHelper {
    constructor(dataLayer, cryptoHelper) {
        this._dataLayer = dataLayer;
        this._config = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getConfigData(); });
        this._oidcProviderMetaData = () => __awaiter(this, void 0, void 0, function* () { return yield this._dataLayer.getOIDCProviderMetaData(); });
        this._cryptoHelper = cryptoHelper;
    }
    resolveEndpoints(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = {};
            const configData = yield this._config();
            configData.endpoints &&
                Object.keys(configData.endpoints).forEach((endpointName) => {
                    const snakeCasedName = endpointName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                    oidcProviderMetaData[snakeCasedName] = (configData === null || configData === void 0 ? void 0 : configData.endpoints)
                        ? configData.endpoints[endpointName]
                        : "";
                });
            return Object.assign(Object.assign({}, response), oidcProviderMetaData);
        });
    }
    resolveEndpointsExplicitly() {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = {};
            const configData = yield this._config();
            const requiredEndpoints = [
                AUTHORIZATION_ENDPOINT,
                END_SESSION_ENDPOINT,
                JWKS_ENDPOINT,
                OIDC_SESSION_IFRAME_ENDPOINT,
                REVOKE_TOKEN_ENDPOINT,
                TOKEN_ENDPOINT,
                ISSUER,
                USERINFO_ENDPOINT
            ];
            const isRequiredEndpointsContains = configData.endpoints
                ? Object.keys(configData === null || configData === void 0 ? void 0 : configData.endpoints).every((endpointName) => {
                    const snakeCasedName = endpointName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                    return requiredEndpoints.includes(snakeCasedName);
                })
                : false;
            if (!isRequiredEndpointsContains) {
                throw new AsgardeoAuthException("JS-AUTH_HELPER-REE-NF01", "No required endpoints.", "Required oidc endpoints are not defined");
            }
            configData.endpoints &&
                Object.keys(configData.endpoints).forEach((endpointName) => {
                    const snakeCasedName = endpointName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                    oidcProviderMetaData[snakeCasedName] = (configData === null || configData === void 0 ? void 0 : configData.endpoints)
                        ? configData.endpoints[endpointName]
                        : "";
                });
            return Object.assign({}, oidcProviderMetaData);
        });
    }
    resolveEndpointsByBaseURL() {
        return __awaiter(this, void 0, void 0, function* () {
            const oidcProviderMetaData = {};
            const configData = yield this._config();
            const baseUrl = configData.baseUrl;
            if (!baseUrl) {
                throw new AsgardeoAuthException("JS-AUTH_HELPER_REBO-NF01", "Base URL not defined.", "Base URL is not defined in AuthClient config.");
            }
            configData.endpoints &&
                Object.keys(configData.endpoints).forEach((endpointName) => {
                    const snakeCasedName = endpointName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                    oidcProviderMetaData[snakeCasedName] = (configData === null || configData === void 0 ? void 0 : configData.endpoints)
                        ? configData.endpoints[endpointName]
                        : "";
                });
            const defaultEndpoints = {
                [AUTHORIZATION_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.authorizationEndpoint}`,
                [END_SESSION_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.endSessionEndpoint}`,
                [ISSUER]: `${baseUrl}${SERVICE_RESOURCES.issuer}`,
                [JWKS_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.jwksUri}`,
                [OIDC_SESSION_IFRAME_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.checkSessionIframe}`,
                [REVOKE_TOKEN_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.revocationEndpoint}`,
                [TOKEN_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.tokenEndpoint}`,
                [USERINFO_ENDPOINT]: `${baseUrl}${SERVICE_RESOURCES.userinfoEndpoint}`
            };
            return Object.assign(Object.assign({}, defaultEndpoints), oidcProviderMetaData);
        });
    }
    validateIdToken(idToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwksEndpoint = (yield this._dataLayer.getOIDCProviderMetaData()).jwks_uri;
            const configData = yield this._config();
            if (!jwksEndpoint || jwksEndpoint.trim().length === 0) {
                throw new AsgardeoAuthException("JS_AUTH_HELPER-VIT-NF01", "JWKS endpoint not found.", "No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint " +
                    "or the JWKS endpoint passed to the SDK is empty.");
            }
            let response;
            try {
                response = yield fetch(jwksEndpoint, {
                    credentials: configData.sendCookiesInRequests
                        ? FetchCredentialTypes.Include
                        : FetchCredentialTypes.SameOrigin
                });
            }
            catch (error) {
                throw new AsgardeoAuthException("JS-AUTH_HELPER-VIT-NE02", "Request to jwks endpoint failed.", error !== null && error !== void 0 ? error : "The request sent to get the jwks from the server failed.");
            }
            if (response.status !== 200 || !response.ok) {
                throw new AsgardeoAuthException("JS-AUTH_HELPER-VIT-HE03", `Invalid response status received for jwks request (${response.statusText}).`, yield response.json());
            }
            const issuer = (yield this._oidcProviderMetaData()).issuer;
            const { keys } = yield response.json();
            const jwk = yield this._cryptoHelper.getJWKForTheIdToken(idToken.split(".")[0], keys);
            return this._cryptoHelper.isValidIdToken(idToken, jwk, (yield this._config()).clientID, issuer !== null && issuer !== void 0 ? issuer : "", this._cryptoHelper.decodeIDToken(idToken).sub, (yield this._config()).clockTolerance);
        });
    }
    getAuthenticatedUserInfo(idToken) {
        var _a, _b, _c, _d;
        const payload = this._cryptoHelper.decodeIDToken(idToken);
        const tenantDomain = AuthenticationUtils.getTenantDomainFromIdTokenPayload(payload);
        const username = (_a = payload === null || payload === void 0 ? void 0 : payload.username) !== null && _a !== void 0 ? _a : "";
        const givenName = (_b = payload.given_name) !== null && _b !== void 0 ? _b : "";
        const familyName = (_c = payload.family_name) !== null && _c !== void 0 ? _c : "";
        const fullName = givenName && familyName
            ? `${givenName} ${familyName}`
            : givenName
                ? givenName
                : familyName
                    ? familyName
                    : "";
        const displayName = (_d = payload.preferred_username) !== null && _d !== void 0 ? _d : fullName;
        return Object.assign({ displayName: displayName, tenantDomain, username: username }, AuthenticationUtils.filterClaimsFromIDTokenPayload(payload));
    }
    replaceCustomGrantTemplateTags(text, userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let scope = OIDC_SCOPE;
            const configData = yield this._config();
            const sessionData = yield this._dataLayer.getSessionData(userID);
            if (configData.scope && configData.scope.length > 0) {
                if (!configData.scope.includes(OIDC_SCOPE)) {
                    configData.scope.push(OIDC_SCOPE);
                }
                scope = configData.scope.join(" ");
            }
            return text
                .replace(TOKEN_TAG, sessionData.access_token)
                .replace(USERNAME_TAG, this.getAuthenticatedUserInfo(sessionData.id_token).username)
                .replace(SCOPE_TAG, scope)
                .replace(CLIENT_ID_TAG, configData.clientID)
                .replace(CLIENT_SECRET_TAG, (_a = configData.clientSecret) !== null && _a !== void 0 ? _a : "");
        });
    }
    clearUserSessionData(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._dataLayer.removeTemporaryData(userID);
            yield this._dataLayer.removeSessionData(userID);
        });
    }
    handleTokenResponse(response, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (response.status !== 200 || !response.ok) {
                throw new AsgardeoAuthException("JS-AUTH_HELPER-HTR-NE01", `Invalid response status received for token request (${response.statusText}).`, yield response.json());
            }
            //Get the response in JSON
            const parsedResponse = yield response.json();
            parsedResponse.created_at = new Date().getTime();
            if ((yield this._config()).validateIDToken) {
                return this.validateIdToken(parsedResponse.id_token).then(() => __awaiter(this, void 0, void 0, function* () {
                    yield this._dataLayer.setSessionData(parsedResponse, userID);
                    const tokenResponse = {
                        accessToken: parsedResponse.access_token,
                        createdAt: parsedResponse.created_at,
                        expiresIn: parsedResponse.expires_in,
                        idToken: parsedResponse.id_token,
                        refreshToken: parsedResponse.refresh_token,
                        scope: parsedResponse.scope,
                        tokenType: parsedResponse.token_type
                    };
                    return Promise.resolve(tokenResponse);
                }));
            }
            else {
                const tokenResponse = {
                    accessToken: parsedResponse.access_token,
                    createdAt: parsedResponse.created_at,
                    expiresIn: parsedResponse.expires_in,
                    idToken: parsedResponse.id_token,
                    refreshToken: parsedResponse.refresh_token,
                    scope: parsedResponse.scope,
                    tokenType: parsedResponse.token_type
                };
                yield this._dataLayer.setSessionData(parsedResponse, userID);
                return Promise.resolve(tokenResponse);
            }
        });
    }
    /**
     * This generates a PKCE key with the right index value.
     *
     * @param {string} userID The userID to identify a user in a multi-user scenario.
     *
     * @returns {string} The PKCE key.
     */
    generatePKCEKey(userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const tempData = yield this._dataLayer.getTemporaryData(userID);
            const keys = [];
            Object.keys(tempData).forEach((key) => {
                if (key.startsWith(PKCE_CODE_VERIFIER)) {
                    keys.push(key);
                }
            });
            const lastKey = keys.sort().pop();
            const index = parseInt((_a = lastKey === null || lastKey === void 0 ? void 0 : lastKey.split(PKCE_SEPARATOR)[1]) !== null && _a !== void 0 ? _a : "-1");
            return `${PKCE_CODE_VERIFIER}${PKCE_SEPARATOR}${index + 1}`;
        });
    }
}
//# sourceMappingURL=authentication-helper.js.map