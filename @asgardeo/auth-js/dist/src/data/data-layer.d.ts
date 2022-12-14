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
import { Stores } from "../constants";
import { AuthClientConfig, OIDCProviderMetaData, SessionData, Store, StoreValue, TemporaryData } from "../models";
export declare class DataLayer<T> {
    protected _id: string;
    protected _store: Store;
    constructor(instanceID: string, store: Store);
    protected setDataInBulk(key: string, data: Partial<AuthClientConfig<T> | OIDCProviderMetaData | SessionData | TemporaryData>): Promise<void>;
    protected setValue(key: string, attribute: keyof AuthClientConfig<T> | keyof OIDCProviderMetaData | keyof SessionData | keyof TemporaryData, value: StoreValue): Promise<void>;
    protected removeValue(key: string, attribute: keyof AuthClientConfig<T> | keyof OIDCProviderMetaData | keyof SessionData | keyof TemporaryData): Promise<void>;
    protected _resolveKey(store: Stores | string, userID?: string): string;
    setConfigData(config: Partial<AuthClientConfig<T>>): Promise<void>;
    setOIDCProviderMetaData(oidcProviderMetaData: Partial<OIDCProviderMetaData>): Promise<void>;
    setTemporaryData(temporaryData: Partial<TemporaryData>, userID?: string): Promise<void>;
    setSessionData(sessionData: Partial<SessionData>, userID?: string): Promise<void>;
    setCustomData<K>(key: string, customData: Partial<K>, userID?: string): Promise<void>;
    getConfigData(): Promise<AuthClientConfig<T>>;
    getOIDCProviderMetaData(): Promise<OIDCProviderMetaData>;
    getTemporaryData(userID?: string): Promise<TemporaryData>;
    getSessionData(userID?: string): Promise<SessionData>;
    getCustomData<K>(key: string, userID?: string): Promise<K>;
    removeConfigData(): Promise<void>;
    removeOIDCProviderMetaData(): Promise<void>;
    removeTemporaryData(userID?: string): Promise<void>;
    removeSessionData(userID?: string): Promise<void>;
    getConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<StoreValue>;
    getOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData): Promise<StoreValue>;
    getTemporaryDataParameter(key: keyof TemporaryData, userID?: string): Promise<StoreValue>;
    getSessionDataParameter(key: keyof SessionData, userID?: string): Promise<StoreValue>;
    setConfigDataParameter(key: keyof AuthClientConfig<T>, value: StoreValue): Promise<void>;
    setOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData, value: StoreValue): Promise<void>;
    setTemporaryDataParameter(key: keyof TemporaryData, value: StoreValue, userID?: string): Promise<void>;
    setSessionDataParameter(key: keyof SessionData, value: StoreValue, userID?: string): Promise<void>;
    removeConfigDataParameter(key: keyof AuthClientConfig<T>): Promise<void>;
    removeOIDCProviderMetaDataParameter(key: keyof OIDCProviderMetaData): Promise<void>;
    removeTemporaryDataParameter(key: keyof TemporaryData, userID?: string): Promise<void>;
    removeSessionDataParameter(key: keyof SessionData, userID?: string): Promise<void>;
}
//# sourceMappingURL=data-layer.d.ts.map