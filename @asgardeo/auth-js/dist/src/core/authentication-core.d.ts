import { DataLayer } from "../data";
import { CryptoHelper } from "../helpers";
import { AuthClientConfig, AuthorizationURLParams, BasicUserInfo, CryptoUtils, CustomGrantConfig, DecodedIDTokenPayload, FetchResponse, OIDCEndpoints, TokenResponse } from "../models";
export declare class AuthenticationCore<T> {
    private _dataLayer;
    private _config;
    private _oidcProviderMetaData;
    private _authenticationHelper;
    private _cryptoUtils;
    private _cryptoHelper;
    constructor(dataLayer: DataLayer<T>, cryptoUtils: CryptoUtils);
    getAuthorizationURL(config?: AuthorizationURLParams, userID?: string): Promise<string>;
    requestAccessToken(authorizationCode: string, sessionState: string, state: string, userID?: string): Promise<TokenResponse>;
    refreshAccessToken(userID?: string): Promise<TokenResponse>;
    revokeAccessToken(userID?: string): Promise<FetchResponse>;
    requestCustomGrant(customGrantParams: CustomGrantConfig, userID?: string): Promise<TokenResponse | FetchResponse>;
    getBasicUserInfo(userID?: string): Promise<BasicUserInfo>;
    getDecodedIDToken(userID?: string): Promise<DecodedIDTokenPayload>;
    getCryptoHelper(): Promise<CryptoHelper>;
    getIDToken(userID?: string): Promise<string>;
    getOIDCProviderMetaData(forceInit: boolean): Promise<void>;
    getOIDCServiceEndpoints(): Promise<OIDCEndpoints>;
    getSignOutURL(userID?: string): Promise<string>;
    clearUserSessionData(userID?: string): Promise<void>;
    getAccessToken(userID?: string): Promise<string>;
    isAuthenticated(userID?: string): Promise<boolean>;
    getPKCECode(state: string, userID?: string): Promise<string>;
    setPKCECode(pkce: string, state: string, userID?: string): Promise<void>;
    updateConfig(config: Partial<AuthClientConfig<T>>): Promise<void>;
}
//# sourceMappingURL=authentication-core.d.ts.map