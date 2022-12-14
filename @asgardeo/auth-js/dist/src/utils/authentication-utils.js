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
import { PKCE_CODE_VERIFIER, PKCE_SEPARATOR } from "../constants";
export class AuthenticationUtils {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static filterClaimsFromIDTokenPayload(payload) {
        const optionalizedPayload = Object.assign({}, payload);
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.iss;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.aud;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.exp;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.iat;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.acr;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.amr;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.azp;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.auth_time;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.nonce;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.c_hash;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.at_hash;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.nbf;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.isk;
        optionalizedPayload === null || optionalizedPayload === void 0 ? true : delete optionalizedPayload.sid;
        const camelCasedPayload = {};
        Object.entries(optionalizedPayload).forEach(([key, value]) => {
            const keyParts = key.split("_");
            const camelCasedKey = keyParts
                .map((key, index) => {
                if (index === 0) {
                    return key;
                }
                return [key[0].toUpperCase(), ...key.slice(1)].join("");
            })
                .join("");
            camelCasedPayload[camelCasedKey] = value;
        });
        return camelCasedPayload;
    }
    static getTokenRequestHeaders() {
        return {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        };
    }
    /**
     * This generates the state param value to be sent with an authorization request.
     *
     * @param {string} pkceKey The PKCE key.
     * @param {string} state The state value to be passed. (The correlation ID will be appended to this state value.)
     *
     * @returns {string} The state param value.
     */
    static generateStateParamForRequestCorrelation(pkceKey, state) {
        const index = parseInt(pkceKey.split(PKCE_SEPARATOR)[1]);
        return state ? `${state}_request_${index}` : `request_${index}`;
    }
    static extractPKCEKeyFromStateParam(stateParam) {
        const index = parseInt(stateParam.split("request_")[1]);
        return `${PKCE_CODE_VERIFIER}${PKCE_SEPARATOR}${index}`;
    }
}
/**
 * @deprecated since v1.0.6 and will be removed with the v2.0.0 release.
 */
AuthenticationUtils.getTenantDomainFromIdTokenPayload = (payload, uidSeparator = "@") => {
    // Try to extract the tenant domain from the `sub` claim.
    const uid = payload.sub;
    const tokens = uid.split(uidSeparator);
    // This works only when the email is used as the username
    // and the tenant domain is appended to the`sub` attribute.
    return tokens.length > 2 ? tokens[tokens.length - 1] : "";
};
//# sourceMappingURL=authentication-utils.js.map