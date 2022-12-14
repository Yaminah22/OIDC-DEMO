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
import { DecodedIDTokenPayload } from "../models";
export declare class AuthenticationUtils {
    private constructor();
    static filterClaimsFromIDTokenPayload(payload: DecodedIDTokenPayload): any;
    /**
     * @deprecated since v1.0.6 and will be removed with the v2.0.0 release.
     */
    static getTenantDomainFromIdTokenPayload: (payload: DecodedIDTokenPayload, uidSeparator?: string) => string;
    static getTokenRequestHeaders(): HeadersInit;
    /**
     * This generates the state param value to be sent with an authorization request.
     *
     * @param {string} pkceKey The PKCE key.
     * @param {string} state The state value to be passed. (The correlation ID will be appended to this state value.)
     *
     * @returns {string} The state param value.
     */
    static generateStateParamForRequestCorrelation(pkceKey: string, state?: string): string;
    static extractPKCEKeyFromStateParam(stateParam: string): string;
}
//# sourceMappingURL=authentication-utils.d.ts.map