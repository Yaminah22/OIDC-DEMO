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
import { Stores } from "../constants";
export class DataLayer {
    constructor(instanceID, store) {
        this._id = instanceID;
        this._store = store;
    }
    setDataInBulk(key, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const existingDataJSON = (_a = (yield this._store.getData(key))) !== null && _a !== void 0 ? _a : null;
            const existingData = existingDataJSON && JSON.parse(existingDataJSON);
            const dataToBeSaved = Object.assign(Object.assign({}, existingData), data);
            const dataToBeSavedJSON = JSON.stringify(dataToBeSaved);
            yield this._store.setData(key, dataToBeSavedJSON);
        });
    }
    setValue(key, attribute, value) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const existingDataJSON = (_a = (yield this._store.getData(key))) !== null && _a !== void 0 ? _a : null;
            const existingData = existingDataJSON && JSON.parse(existingDataJSON);
            const dataToBeSaved = Object.assign(Object.assign({}, existingData), { [attribute]: value });
            const dataToBeSavedJSON = JSON.stringify(dataToBeSaved);
            yield this._store.setData(key, dataToBeSavedJSON);
        });
    }
    removeValue(key, attribute) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const existingDataJSON = (_a = (yield this._store.getData(key))) !== null && _a !== void 0 ? _a : null;
            const existingData = existingDataJSON && JSON.parse(existingDataJSON);
            const dataToBeSaved = Object.assign({}, existingData);
            delete dataToBeSaved[attribute];
            const dataToBeSavedJSON = JSON.stringify(dataToBeSaved);
            yield this._store.setData(key, dataToBeSavedJSON);
        });
    }
    _resolveKey(store, userID) {
        return userID ? `${store}-${this._id}-${userID}` : `${store}-${this._id}`;
    }
    setConfigData(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setDataInBulk(this._resolveKey(Stores.ConfigData), config);
        });
    }
    setOIDCProviderMetaData(oidcProviderMetaData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setDataInBulk(this._resolveKey(Stores.OIDCProviderMetaData), oidcProviderMetaData);
        });
    }
    setTemporaryData(temporaryData, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setDataInBulk(this._resolveKey(Stores.TemporaryData, userID), temporaryData);
        });
    }
    setSessionData(sessionData, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setDataInBulk(this._resolveKey(Stores.SessionData, userID), sessionData);
        });
    }
    setCustomData(key, customData, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setDataInBulk(this._resolveKey(key, userID), customData);
        });
    }
    getConfigData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((_a = (yield this._store.getData(this._resolveKey(Stores.ConfigData)))) !== null && _a !== void 0 ? _a : null);
        });
    }
    getOIDCProviderMetaData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((_a = (yield this._store.getData(this._resolveKey(Stores.OIDCProviderMetaData)))) !== null && _a !== void 0 ? _a : null);
        });
    }
    getTemporaryData(userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((_a = (yield this._store.getData(this._resolveKey(Stores.TemporaryData, userID)))) !== null && _a !== void 0 ? _a : null);
        });
    }
    getSessionData(userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((_a = (yield this._store.getData(this._resolveKey(Stores.SessionData, userID)))) !== null && _a !== void 0 ? _a : null);
        });
    }
    getCustomData(key, userID) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse((_a = (yield this._store.getData(this._resolveKey(key, userID)))) !== null && _a !== void 0 ? _a : null);
        });
    }
    removeConfigData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._store.removeData(this._resolveKey(Stores.ConfigData));
        });
    }
    removeOIDCProviderMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._store.removeData(this._resolveKey(Stores.OIDCProviderMetaData));
        });
    }
    removeTemporaryData(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._store.removeData(this._resolveKey(Stores.TemporaryData, userID));
        });
    }
    removeSessionData(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._store.removeData(this._resolveKey(Stores.SessionData, userID));
        });
    }
    getConfigDataParameter(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._store.getData(this._resolveKey(Stores.ConfigData));
            return data && JSON.parse(data)[key];
        });
    }
    getOIDCProviderMetaDataParameter(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._store.getData(this._resolveKey(Stores.OIDCProviderMetaData));
            return data && JSON.parse(data)[key];
        });
    }
    getTemporaryDataParameter(key, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._store.getData(this._resolveKey(Stores.TemporaryData, userID));
            return data && JSON.parse(data)[key];
        });
    }
    getSessionDataParameter(key, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._store.getData(this._resolveKey(Stores.SessionData, userID));
            return data && JSON.parse(data)[key];
        });
    }
    setConfigDataParameter(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setValue(this._resolveKey(Stores.ConfigData), key, value);
        });
    }
    setOIDCProviderMetaDataParameter(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setValue(this._resolveKey(Stores.OIDCProviderMetaData), key, value);
        });
    }
    setTemporaryDataParameter(key, value, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setValue(this._resolveKey(Stores.TemporaryData, userID), key, value);
        });
    }
    setSessionDataParameter(key, value, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setValue(this._resolveKey(Stores.SessionData, userID), key, value);
        });
    }
    removeConfigDataParameter(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeValue(this._resolveKey(Stores.ConfigData), key);
        });
    }
    removeOIDCProviderMetaDataParameter(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeValue(this._resolveKey(Stores.OIDCProviderMetaData), key);
        });
    }
    removeTemporaryDataParameter(key, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeValue(this._resolveKey(Stores.TemporaryData, userID), key);
        });
    }
    removeSessionDataParameter(key, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeValue(this._resolveKey(Stores.SessionData, userID), key);
        });
    }
}
//# sourceMappingURL=data-layer.js.map