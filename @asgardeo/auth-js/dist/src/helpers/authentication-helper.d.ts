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
import { CryptoHelper } from "./crypto-helper";
import { DataLayer } from "../data";
import { AuthenticatedUserInfo, OIDCEndpointsInternal, OIDCProviderMetaData, TokenResponse } from "../models";
export declare class AuthenticationHelper<T> {
    private _dataLayer;
    private _config;
    private _oidcProviderMetaData;
    private _cryptoHelper;
    constructor(dataLayer: DataLayer<T>, cryptoHelper: CryptoHelper);
    resolveEndpoints(response: OIDCProviderMetaData): Promise<OIDCProviderMetaData>;
    resolveEndpointsExplicitly(): Promise<OIDCEndpointsInternal>;
    resolveEndpointsByBaseURL(): Promise<OIDCEndpointsInternal>;
    validateIdToken(idToken: string): Promise<boolean>;
    getAuthenticatedUserInfo(idToken: string): AuthenticatedUserInfo;
    replaceCustomGrantTemplateTags(text: string, userID?: string): Promise<string>;
    clearUserSessionData(userID?: string): Promise<void>;
    handleTokenResponse(response: Response, userID?: string): Promise<TokenResponse>;
    /**
     * This generates a PKCE key with the right index value.
     *
     * @param {string} userID The userID to identify a user in a multi-user scenario.
     *
     * @returns {string} The PKCE key.
     */
    generatePKCEKey(userID?: string): Promise<string>;
}
//# sourceMappingURL=authentication-helper.d.ts.map