!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).AsgardeoAuth={})}(this,(function(e){"use strict";function t(e,t,i,o){return new(i||(i=Promise))((function(n,r){function s(e){try{d(o.next(e))}catch(e){r(e)}}function a(e){try{d(o.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(s,a)}d((o=o.apply(e,t||[])).next())}))}var i;e.ResponseMode=void 0,(i=e.ResponseMode||(e.ResponseMode={})).formPost="form_post",i.query="query";const o="/oauth2/authorize",n="/oidc/checksession",r="/oidc/logout",s="/oauth2/token",a="/oauth2/jwks",d="/oauth2/revoke",c="/oauth2/token",l="/oauth2/userinfo",u="authorization_endpoint",h="token_endpoint",v="revocation_endpoint",_="end_session_endpoint",p="jwks_uri",y="op_config_initiated",f="check_session_iframe",g="userinfo_endpoint",D="issuer",m="{{token}}",k="{{username}}",T="{{scope}}",S="{{clientID}}",C="{{clientSecret}}";var O;e.Stores=void 0,(O=e.Stores||(e.Stores={})).ConfigData="config_data",O.OIDCProviderMetaData="oidc_provider_meta_data",O.SessionData="session_data",O.TemporaryData="temporary_data";const I="pkce_code_verifier",P="#",R=["RS256","RS512","RS384","PS256"],w="session_state",E="sign_out_success",A="state",U="openid";var L;!function(e){e.Include="include",e.SameOrigin="same-origin",e.Omit="omit"}(L||(L={}));class H{constructor(e,t,i){this.message=i,this.name=t,this.code=e,Object.setPrototypeOf(this,new.target.prototype)}}class K{constructor(){}static filterClaimsFromIDTokenPayload(e){const t=Object.assign({},e);null==t||delete t.iss,null==t||delete t.aud,null==t||delete t.exp,null==t||delete t.iat,null==t||delete t.acr,null==t||delete t.amr,null==t||delete t.azp,null==t||delete t.auth_time,null==t||delete t.nonce,null==t||delete t.c_hash,null==t||delete t.at_hash,null==t||delete t.nbf,null==t||delete t.isk,null==t||delete t.sid;const i={};return Object.entries(t).forEach((([e,t])=>{const o=e.split("_").map(((e,t)=>0===t?e:[e[0].toUpperCase(),...e.slice(1)].join(""))).join("");i[o]=t})),i}static getTokenRequestHeaders(){return{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}static generateStateParamForRequestCorrelation(e,t){const i=parseInt(e.split(P)[1]);return t?`${t}_request_${i}`:`request_${i}`}static extractPKCEKeyFromStateParam(e){return`pkce_code_verifier#${parseInt(e.split("request_")[1])}`}}K.getTenantDomainFromIdTokenPayload=(e,t="@")=>{const i=e.sub.split(t);return i.length>2?i[i.length-1]:""};class b{constructor(e,i){this._dataLayer=e,this._config=()=>t(this,void 0,void 0,(function*(){return yield this._dataLayer.getConfigData()})),this._oidcProviderMetaData=()=>t(this,void 0,void 0,(function*(){return yield this._dataLayer.getOIDCProviderMetaData()})),this._cryptoHelper=i}resolveEndpoints(e){return t(this,void 0,void 0,(function*(){const t={},i=yield this._config();return i.endpoints&&Object.keys(i.endpoints).forEach((e=>{const o=e.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));t[o]=(null==i?void 0:i.endpoints)?i.endpoints[e]:""})),Object.assign(Object.assign({},e),t)}))}resolveEndpointsExplicitly(){return t(this,void 0,void 0,(function*(){const e={},t=yield this._config(),i=[u,_,p,f,v,h,D,g];if(!(!!t.endpoints&&Object.keys(null==t?void 0:t.endpoints).every((e=>{const t=e.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));return i.includes(t)}))))throw new H("JS-AUTH_HELPER-REE-NF01","No required endpoints.","Required oidc endpoints are not defined");return t.endpoints&&Object.keys(t.endpoints).forEach((i=>{const o=i.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));e[o]=(null==t?void 0:t.endpoints)?t.endpoints[i]:""})),Object.assign({},e)}))}resolveEndpointsByBaseURL(){return t(this,void 0,void 0,(function*(){const e={},t=yield this._config(),i=t.baseUrl;if(!i)throw new H("JS-AUTH_HELPER_REBO-NF01","Base URL not defined.","Base URL is not defined in AuthClient config.");t.endpoints&&Object.keys(t.endpoints).forEach((i=>{const o=i.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));e[o]=(null==t?void 0:t.endpoints)?t.endpoints[i]:""}));const y={[u]:`${i}${o}`,[_]:`${i}${r}`,[D]:`${i}${s}`,[p]:`${i}${a}`,[f]:`${i}${n}`,[v]:`${i}${d}`,[h]:`${i}${c}`,[g]:`${i}${l}`};return Object.assign(Object.assign({},y),e)}))}validateIdToken(e){return t(this,void 0,void 0,(function*(){const t=(yield this._dataLayer.getOIDCProviderMetaData()).jwks_uri,i=yield this._config();if(!t||0===t.trim().length)throw new H("JS_AUTH_HELPER-VIT-NF01","JWKS endpoint not found.","No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the JWKS endpoint passed to the SDK is empty.");let o;try{o=yield fetch(t,{credentials:i.sendCookiesInRequests?L.Include:L.SameOrigin})}catch(e){throw new H("JS-AUTH_HELPER-VIT-NE02","Request to jwks endpoint failed.",null!=e?e:"The request sent to get the jwks from the server failed.")}if(200!==o.status||!o.ok)throw new H("JS-AUTH_HELPER-VIT-HE03",`Invalid response status received for jwks request (${o.statusText}).`,yield o.json());const n=(yield this._oidcProviderMetaData()).issuer,{keys:r}=yield o.json(),s=yield this._cryptoHelper.getJWKForTheIdToken(e.split(".")[0],r);return this._cryptoHelper.isValidIdToken(e,s,(yield this._config()).clientID,null!=n?n:"",this._cryptoHelper.decodeIDToken(e).sub,(yield this._config()).clockTolerance)}))}getAuthenticatedUserInfo(e){var t,i,o,n;const r=this._cryptoHelper.decodeIDToken(e),s=K.getTenantDomainFromIdTokenPayload(r),a=null!==(t=null==r?void 0:r.username)&&void 0!==t?t:"",d=null!==(i=r.given_name)&&void 0!==i?i:"",c=null!==(o=r.family_name)&&void 0!==o?o:"",l=d&&c?`${d} ${c}`:d||(c||""),u=null!==(n=r.preferred_username)&&void 0!==n?n:l;return Object.assign({displayName:u,tenantDomain:s,username:a},K.filterClaimsFromIDTokenPayload(r))}replaceCustomGrantTemplateTags(e,i){var o;return t(this,void 0,void 0,(function*(){let t=U;const n=yield this._config(),r=yield this._dataLayer.getSessionData(i);return n.scope&&n.scope.length>0&&(n.scope.includes(U)||n.scope.push(U),t=n.scope.join(" ")),e.replace(m,r.access_token).replace(k,this.getAuthenticatedUserInfo(r.id_token).username).replace(T,t).replace(S,n.clientID).replace(C,null!==(o=n.clientSecret)&&void 0!==o?o:"")}))}clearUserSessionData(e){return t(this,void 0,void 0,(function*(){yield this._dataLayer.removeTemporaryData(e),yield this._dataLayer.removeSessionData(e)}))}handleTokenResponse(e,i){return t(this,void 0,void 0,(function*(){if(200!==e.status||!e.ok)throw new H("JS-AUTH_HELPER-HTR-NE01",`Invalid response status received for token request (${e.statusText}).`,yield e.json());const o=yield e.json();if(o.created_at=(new Date).getTime(),(yield this._config()).validateIDToken)return this.validateIdToken(o.id_token).then((()=>t(this,void 0,void 0,(function*(){yield this._dataLayer.setSessionData(o,i);const e={accessToken:o.access_token,createdAt:o.created_at,expiresIn:o.expires_in,idToken:o.id_token,refreshToken:o.refresh_token,scope:o.scope,tokenType:o.token_type};return Promise.resolve(e)}))));{const e={accessToken:o.access_token,createdAt:o.created_at,expiresIn:o.expires_in,idToken:o.id_token,refreshToken:o.refresh_token,scope:o.scope,tokenType:o.token_type};return yield this._dataLayer.setSessionData(o,i),Promise.resolve(e)}}))}generatePKCEKey(e){var i;return t(this,void 0,void 0,(function*(){const t=yield this._dataLayer.getTemporaryData(e),o=[];Object.keys(t).forEach((e=>{e.startsWith(I)&&o.push(e)}));const n=o.sort().pop();return`pkce_code_verifier#${parseInt(null!==(i=null==n?void 0:n.split(P)[1])&&void 0!==i?i:"-1")+1}`}))}}class j{constructor(e){this._cryptoUtils=e}getCodeVerifier(){return this._cryptoUtils.base64URLEncode(this._cryptoUtils.generateRandomBytes(32))}getCodeChallenge(e){return this._cryptoUtils.base64URLEncode(this._cryptoUtils.hashSha256(e))}getJWKForTheIdToken(e,t){const i=JSON.parse(this._cryptoUtils.base64URLDecode(e));for(const e of t)if(i.kid===e.kid)return e;throw new H("JS-CRYPTO_UTIL-GJFTIT-IV01","kid not found.","Failed to find the 'kid' specified in the id_token. 'kid' found in the header : "+i.kid+", Expected values: "+t.map((e=>e.kid)).join(", "))}isValidIdToken(e,t,i,o,n,r){return this._cryptoUtils.verifyJwt(e,t,R,i,o,n,r).then((e=>e?Promise.resolve(!0):Promise.reject(new H("JS-CRYPTO_HELPER-IVIT-IV01","Invalid ID token.","ID token validation returned false"))))}decodeIDToken(e){try{const t=this._cryptoUtils.base64URLDecode(e.split(".")[1]);return JSON.parse(t)}catch(e){throw new H("JS-CRYPTO_UTIL-DIT-IV01","Decoding ID token failed.",e)}}}class N{constructor(e,i){this._cryptoUtils=i,this._cryptoHelper=new j(i),this._authenticationHelper=new b(e,this._cryptoHelper),this._dataLayer=e,this._config=()=>t(this,void 0,void 0,(function*(){return yield this._dataLayer.getConfigData()})),this._oidcProviderMetaData=()=>t(this,void 0,void 0,(function*(){return yield this._dataLayer.getOIDCProviderMetaData()}))}getAuthorizationURL(e,i){var o,n,r;return t(this,void 0,void 0,(function*(){const t=yield this._dataLayer.getOIDCProviderMetaDataParameter(u),s=yield this._config();if(!t||0===t.trim().length)throw new H("JS-AUTH_CORE-GAU-NF01","No authorization endpoint found.","No authorization endpoint was found in the OIDC provider meta data from the well-known endpoint or the authorization endpoint passed to the SDK is empty.");const a=new URL(t),d=new Map;d.set("response_type","code"),d.set("client_id",s.clientID);let c=U;s.scope&&s.scope.length>0&&(s.scope.includes(U)||s.scope.push(U),c=s.scope.join(" ")),d.set("scope",c),d.set("redirect_uri",s.signInRedirectURL),s.responseMode&&d.set("response_mode",s.responseMode);const l=yield this._authenticationHelper.generatePKCEKey(i);if(s.enablePKCE){const e=null===(o=this._cryptoHelper)||void 0===o?void 0:o.getCodeVerifier(),t=null===(n=this._cryptoHelper)||void 0===n?void 0:n.getCodeChallenge(e);yield this._dataLayer.setTemporaryDataParameter(l,e,i),d.set("code_challenge_method","S256"),d.set("code_challenge",t)}s.prompt&&d.set("prompt",s.prompt);const h=e;if(h)for(const[e,t]of Object.entries(h))if(""!=e&&""!=t&&e!==A){const i=e.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));d.set(i,t.toString())}d.set(A,K.generateStateParamForRequestCorrelation(l,h?null===(r=h.state)||void 0===r?void 0:r.toString():""));for(const[e,t]of d.entries())a.searchParams.append(e,t);return a.toString()}))}requestAccessToken(e,i,o,n){return t(this,void 0,void 0,(function*(){const t=(yield this._oidcProviderMetaData()).token_endpoint,r=yield this._config();if(!t||0===t.trim().length)throw new H("JS-AUTH_CORE-RAT1-NF01","Token endpoint not found.","No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the token endpoint passed to the SDK is empty.");i&&(yield this._dataLayer.setSessionDataParameter(w,i,n));const s=[];s.push(`client_id=${r.clientID}`),r.clientSecret&&r.clientSecret.trim().length>0&&s.push(`client_secret=${r.clientSecret}`);const a=e;let d;s.push(`code=${a}`),s.push("grant_type=authorization_code"),s.push(`redirect_uri=${r.signInRedirectURL}`),r.enablePKCE&&(s.push(`code_verifier=${yield this._dataLayer.getTemporaryDataParameter(K.extractPKCEKeyFromStateParam(o),n)}`),yield this._dataLayer.removeTemporaryDataParameter(K.extractPKCEKeyFromStateParam(o),n));try{d=yield fetch(t,{body:s.join("&"),credentials:r.sendCookiesInRequests?L.Include:L.SameOrigin,headers:new Headers(K.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new H("JS-AUTH_CORE-RAT1-NE02","Requesting access token failed",null!=e?e:"The request to get the access token from the server failed.")}if(!d.ok)throw new H("JS-AUTH_CORE-RAT1-HE03",`Requesting access token failed with ${d.statusText}`,yield d.json());return yield this._authenticationHelper.handleTokenResponse(d,n)}))}refreshAccessToken(e){return t(this,void 0,void 0,(function*(){const t=(yield this._oidcProviderMetaData()).token_endpoint,i=yield this._config(),o=yield this._dataLayer.getSessionData(e);if(!o.refresh_token)throw new H("JS-AUTH_CORE-RAT2-NF01","No refresh token found.","There was no refresh token found. Asgardeo doesn't return a refresh token if the refresh token grant is not enabled.");if(!t||0===t.trim().length)throw new H("JS-AUTH_CORE-RAT2-NF02","No refresh token endpoint found.","No refresh token endpoint was in the OIDC provider meta data returned by the well-known endpoint or the refresh token endpoint passed to the SDK is empty.");const n=[];let r;n.push(`client_id=${i.clientID}`),n.push(`refresh_token=${o.refresh_token}`),n.push("grant_type=refresh_token"),i.clientSecret&&i.clientSecret.trim().length>0&&n.push(`client_secret=${i.clientSecret}`);try{r=yield fetch(t,{body:n.join("&"),credentials:i.sendCookiesInRequests?L.Include:L.SameOrigin,headers:new Headers(K.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new H("JS-AUTH_CORE-RAT2-NR03","Refresh access token request failed.",null!=e?e:"The request to refresh the access token failed.")}if(!r.ok)throw new H("JS-AUTH_CORE-RAT2-HE04",`Refreshing access token failed with ${r.statusText}`,yield r.json());return this._authenticationHelper.handleTokenResponse(r,e)}))}revokeAccessToken(e){return t(this,void 0,void 0,(function*(){const t=(yield this._oidcProviderMetaData()).revocation_endpoint,i=yield this._config();if(!t||0===t.trim().length)throw new H("JS-AUTH_CORE-RAT3-NF01","No revoke access token endpoint found.","No revoke access token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the revoke access token endpoint passed to the SDK is empty.");const o=[];let n;o.push(`client_id=${i.clientID}`),o.push(`token=${(yield this._dataLayer.getSessionData(e)).access_token}`),o.push("token_type_hint=access_token");try{n=yield fetch(t,{body:o.join("&"),credentials:i.sendCookiesInRequests?L.Include:L.SameOrigin,headers:new Headers(K.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new H("JS-AUTH_CORE-RAT3-NE02","The request to revoke access token failed.",null!=e?e:"The request sent to revoke the access token failed.")}if(200!==n.status||!n.ok)throw new H("JS-AUTH_CORE-RAT3-HE03",`Invalid response status received for revoke access token request (${n.statusText}).`,yield n.json());return this._authenticationHelper.clearUserSessionData(e),Promise.resolve(n)}))}requestCustomGrant(e,i){return t(this,void 0,void 0,(function*(){const o=yield this._oidcProviderMetaData(),n=yield this._config();let r;if(r=e.tokenEndpoint&&0!==e.tokenEndpoint.trim().length?e.tokenEndpoint:o.token_endpoint,!r||0===r.trim().length)throw new H("JS-AUTH_CORE-RCG-NF01","Token endpoint not found.","No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the token endpoint passed to the SDK is empty.");const s=yield Promise.all(Object.entries(e.data).map((([e,o])=>t(this,void 0,void 0,(function*(){const t=yield this._authenticationHelper.replaceCustomGrantTemplateTags(o,i);return`${e}=${t}`})))));let a=Object.assign({},K.getTokenRequestHeaders());e.attachToken&&(a=Object.assign(Object.assign({},a),{Authorization:`Bearer ${(yield this._dataLayer.getSessionData(i)).access_token}`}));const d={body:s.join("&"),credentials:n.sendCookiesInRequests?L.Include:L.SameOrigin,headers:new Headers(a),method:"POST"};let c;try{c=yield fetch(r,d)}catch(e){throw new H("JS-AUTH_CORE-RCG-NE02","The custom grant request failed.",null!=e?e:"The request sent to get the custom grant failed.")}if(200!==c.status||!c.ok)throw new H("JS-AUTH_CORE-RCG-HE03",`Invalid response status received for the custom grant request. (${c.statusText})`,yield c.json());return e.returnsSession?this._authenticationHelper.handleTokenResponse(c,i):Promise.resolve(yield c.json())}))}getBasicUserInfo(e){return t(this,void 0,void 0,(function*(){const t=yield this._dataLayer.getSessionData(e),i=this._authenticationHelper.getAuthenticatedUserInfo(null==t?void 0:t.id_token);let o={allowedScopes:t.scope,sessionState:t.session_state};return Object.keys(i).forEach((e=>{void 0!==i[e]&&""!==i[e]&&null!==i[e]||delete i[e]})),o=Object.assign(Object.assign({},o),i),o}))}getDecodedIDToken(e){return t(this,void 0,void 0,(function*(){const t=(yield this._dataLayer.getSessionData(e)).id_token;return this._cryptoHelper.decodeIDToken(t)}))}getCryptoHelper(){return t(this,void 0,void 0,(function*(){return this._cryptoHelper}))}getIDToken(e){return t(this,void 0,void 0,(function*(){return(yield this._dataLayer.getSessionData(e)).id_token}))}getOIDCProviderMetaData(e){return t(this,void 0,void 0,(function*(){const t=yield this._config();if(!e&&(yield this._dataLayer.getTemporaryDataParameter(y)))return Promise.resolve();const i=t.wellKnownEndpoint;if(i){let e;try{if(e=yield fetch(i),200!==e.status||!e.ok)throw new Error}catch(e){throw new H("JS-AUTH_CORE-GOPMD-HE01","Invalid well-known response","The well known endpoint response has been failed with an error.")}return yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpoints(yield e.json())),yield this._dataLayer.setTemporaryDataParameter(y,!0),Promise.resolve()}if(t.baseUrl){try{yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsByBaseURL())}catch(e){throw new H("JS-AUTH_CORE-GOPMD-IV02","Resolving endpoints failed.",null!=e?e:"Resolving endpoints by base url failed.")}return yield this._dataLayer.setTemporaryDataParameter(y,!0),Promise.resolve()}try{yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsExplicitly())}catch(e){throw new H("JS-AUTH_CORE-GOPMD-IV03","Resolving endpoints failed.",null!=e?e:"Resolving endpoints by explicitly failed.")}return yield this._dataLayer.setTemporaryDataParameter(y,!0),Promise.resolve()}))}getOIDCServiceEndpoints(){var e,i,o,n,r,s,a,d,c,l;return t(this,void 0,void 0,(function*(){const t=yield this._oidcProviderMetaData();return{authorizationEndpoint:null!==(e=t.authorization_endpoint)&&void 0!==e?e:"",checkSessionIframe:null!==(i=t.check_session_iframe)&&void 0!==i?i:"",endSessionEndpoint:null!==(o=t.end_session_endpoint)&&void 0!==o?o:"",introspectionEndpoint:null!==(n=t.introspection_endpoint)&&void 0!==n?n:"",issuer:null!==(r=t.issuer)&&void 0!==r?r:"",jwksUri:null!==(s=t.jwks_uri)&&void 0!==s?s:"",registrationEndpoint:null!==(a=t.registration_endpoint)&&void 0!==a?a:"",revocationEndpoint:null!==(d=t.revocation_endpoint)&&void 0!==d?d:"",tokenEndpoint:null!==(c=t.token_endpoint)&&void 0!==c?c:"",userinfoEndpoint:null!==(l=t.userinfo_endpoint)&&void 0!==l?l:""}}))}getSignOutURL(e){var i,o,n;return t(this,void 0,void 0,(function*(){const t=null===(i=yield this._oidcProviderMetaData())||void 0===i?void 0:i.end_session_endpoint,r=yield this._config();if(!t||0===t.trim().length)throw new H("JS-AUTH_CORE-GSOU-NF01","Sign-out endpoint not found.","No sign-out endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the sign-out endpoint passed to the SDK is empty.");const s=null===(o=yield this._dataLayer.getSessionData(e))||void 0===o?void 0:o.id_token;if(!s||0===s.trim().length)throw new H("JS-AUTH_CORE-GSOU-NF02","ID token not found.","No ID token could be found. Either the session information is lost or you have not signed in.");const a=null!==(n=null==r?void 0:r.signOutRedirectURL)&&void 0!==n?n:null==r?void 0:r.signInRedirectURL;if(!a||0===a.trim().length)throw new H("JS-AUTH_CORE-GSOU-NF03","No sign-out redirect URL found.","The sign-out redirect URL cannot be found or the URL passed to the SDK is empty. No sign-in redirect URL has been found either. ");return`${t}?id_token_hint=${s}&post_logout_redirect_uri=${a}&state=sign_out_success`}))}clearUserSessionData(e){return t(this,void 0,void 0,(function*(){yield this._authenticationHelper.clearUserSessionData(e)}))}getAccessToken(e){var i;return t(this,void 0,void 0,(function*(){return null===(i=yield this._dataLayer.getSessionData(e))||void 0===i?void 0:i.access_token}))}isAuthenticated(e){return t(this,void 0,void 0,(function*(){return Boolean(yield this.getAccessToken(e))}))}getPKCECode(e,i){return t(this,void 0,void 0,(function*(){return yield this._dataLayer.getTemporaryDataParameter(K.extractPKCEKeyFromStateParam(e),i)}))}setPKCECode(e,i,o){return t(this,void 0,void 0,(function*(){return yield this._dataLayer.setTemporaryDataParameter(K.extractPKCEKeyFromStateParam(i),e,o)}))}updateConfig(e){return t(this,void 0,void 0,(function*(){yield this._dataLayer.setConfigData(e),yield this.getOIDCProviderMetaData(!0)}))}}class ${constructor(e,t){this._id=e,this._store=t}setDataInBulk(e,i){var o;return t(this,void 0,void 0,(function*(){const t=null!==(o=yield this._store.getData(e))&&void 0!==o?o:null,n=t&&JSON.parse(t),r=Object.assign(Object.assign({},n),i),s=JSON.stringify(r);yield this._store.setData(e,s)}))}setValue(e,i,o){var n;return t(this,void 0,void 0,(function*(){const t=null!==(n=yield this._store.getData(e))&&void 0!==n?n:null,r=t&&JSON.parse(t),s=Object.assign(Object.assign({},r),{[i]:o}),a=JSON.stringify(s);yield this._store.setData(e,a)}))}removeValue(e,i){var o;return t(this,void 0,void 0,(function*(){const t=null!==(o=yield this._store.getData(e))&&void 0!==o?o:null,n=t&&JSON.parse(t),r=Object.assign({},n);delete r[i];const s=JSON.stringify(r);yield this._store.setData(e,s)}))}_resolveKey(e,t){return t?`${e}-${this._id}-${t}`:`${e}-${this._id}`}setConfigData(i){return t(this,void 0,void 0,(function*(){yield this.setDataInBulk(this._resolveKey(e.Stores.ConfigData),i)}))}setOIDCProviderMetaData(i){return t(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(e.Stores.OIDCProviderMetaData),i)}))}setTemporaryData(i,o){return t(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(e.Stores.TemporaryData,o),i)}))}setSessionData(i,o){return t(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(e.Stores.SessionData,o),i)}))}setCustomData(e,i,o){return t(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(e,o),i)}))}getConfigData(){var i;return t(this,void 0,void 0,(function*(){return JSON.parse(null!==(i=yield this._store.getData(this._resolveKey(e.Stores.ConfigData)))&&void 0!==i?i:null)}))}getOIDCProviderMetaData(){var i;return t(this,void 0,void 0,(function*(){return JSON.parse(null!==(i=yield this._store.getData(this._resolveKey(e.Stores.OIDCProviderMetaData)))&&void 0!==i?i:null)}))}getTemporaryData(i){var o;return t(this,void 0,void 0,(function*(){return JSON.parse(null!==(o=yield this._store.getData(this._resolveKey(e.Stores.TemporaryData,i)))&&void 0!==o?o:null)}))}getSessionData(i){var o;return t(this,void 0,void 0,(function*(){return JSON.parse(null!==(o=yield this._store.getData(this._resolveKey(e.Stores.SessionData,i)))&&void 0!==o?o:null)}))}getCustomData(e,i){var o;return t(this,void 0,void 0,(function*(){return JSON.parse(null!==(o=yield this._store.getData(this._resolveKey(e,i)))&&void 0!==o?o:null)}))}removeConfigData(){return t(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(e.Stores.ConfigData))}))}removeOIDCProviderMetaData(){return t(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(e.Stores.OIDCProviderMetaData))}))}removeTemporaryData(i){return t(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(e.Stores.TemporaryData,i))}))}removeSessionData(i){return t(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(e.Stores.SessionData,i))}))}getConfigDataParameter(i){return t(this,void 0,void 0,(function*(){const t=yield this._store.getData(this._resolveKey(e.Stores.ConfigData));return t&&JSON.parse(t)[i]}))}getOIDCProviderMetaDataParameter(i){return t(this,void 0,void 0,(function*(){const t=yield this._store.getData(this._resolveKey(e.Stores.OIDCProviderMetaData));return t&&JSON.parse(t)[i]}))}getTemporaryDataParameter(i,o){return t(this,void 0,void 0,(function*(){const t=yield this._store.getData(this._resolveKey(e.Stores.TemporaryData,o));return t&&JSON.parse(t)[i]}))}getSessionDataParameter(i,o){return t(this,void 0,void 0,(function*(){const t=yield this._store.getData(this._resolveKey(e.Stores.SessionData,o));return t&&JSON.parse(t)[i]}))}setConfigDataParameter(i,o){return t(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(e.Stores.ConfigData),i,o)}))}setOIDCProviderMetaDataParameter(i,o){return t(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(e.Stores.OIDCProviderMetaData),i,o)}))}setTemporaryDataParameter(i,o,n){return t(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(e.Stores.TemporaryData,n),i,o)}))}setSessionDataParameter(i,o,n){return t(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(e.Stores.SessionData,n),i,o)}))}removeConfigDataParameter(i){return t(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(e.Stores.ConfigData),i)}))}removeOIDCProviderMetaDataParameter(i){return t(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(e.Stores.OIDCProviderMetaData),i)}))}removeTemporaryDataParameter(i,o){return t(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(e.Stores.TemporaryData,o),i)}))}removeSessionDataParameter(i,o){return t(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(e.Stores.SessionData,o),i)}))}}const J={clockTolerance:300,enablePKCE:!0,responseMode:e.ResponseMode.query,scope:[U],sendCookiesInRequests:!0,validateIDToken:!0};class M{
/**
         * This is the constructor method that returns an instance of the .
         *
         * @param {Store} store - The store object.
         *
         * @example
         * ```
         * const _store: Store = new DataStore();
         * const auth = new AsgardeoAuthClient<CustomClientConfig>(_store);
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#constructor
         * @preserve
         */
constructor(e,t){M._instanceID?M._instanceID+=1:M._instanceID=0,this._dataLayer=new $(`instance_${M._instanceID}`,e),this._authenticationCore=new N(this._dataLayer,t),M._authenticationCore=new N(this._dataLayer,t)}
/**
         *
         * This method initializes the SDK with the config data.
         *
         * @param {AuthClientConfig<T>} config - The config object to initialize with.
         *
         * @example
         * const config = {
         *     signInRedirectURL: "http://localhost:3000/sign-in",
         *     clientID: "client ID",
         *     baseUrl: "https://localhost:9443"
         * }
         *
         * await auth.initialize(config);
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#initialize
         *
         * @preserve
         */initialize(e){var i,o,n;return t(this,void 0,void 0,(function*(){yield this._dataLayer.setConfigData(Object.assign(Object.assign(Object.assign({},J),e),{scope:[...null!==(i=J.scope)&&void 0!==i?i:[],...null!==(n=null===(o=e.scope)||void 0===o?void 0:o.filter((e=>{var t;return!(null===(t=null==J?void 0:J.scope)||void 0===t?void 0:t.includes(e))})))&&void 0!==n?n:[]]}))}))}
/**
         * This method returns the `DataLayer` object that allows you to access authentication data.
         *
         * @return {DataLayer} - The `DataLayer` object.
         *
         * @example
         * ```
         * const data = auth.getDataLayer();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDataLayer
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getDataLayer(){return this._dataLayer}
/**
         * This is an async method that returns a Promise that resolves with the authorization URL.
         *
         * @param {GetAuthURLConfig} config - (Optional) A config object to force initialization and pass
         * custom path parameters such as the fidp parameter.
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<string>} - A promise that resolves with the authorization URL.
         *
         * @example
         * ```
         * auth.getAuthorizationURL().then((url)=>{
         *  // console.log(url);
         * }).catch((error)=>{
         *  // console.error(error);
         * });
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAuthorizationURL
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getAuthorizationURL(e,i){return t(this,void 0,void 0,(function*(){const t=Object.assign({},e);return null==t||delete t.forceInit,(yield this._dataLayer.getTemporaryDataParameter(y))?this._authenticationCore.getAuthorizationURL(t,i):this._authenticationCore.getOIDCProviderMetaData(null==e?void 0:e.forceInit).then((()=>this._authenticationCore.getAuthorizationURL(t,i)))}))}
/**
         * This is an async method that sends a request to obtain the access token and returns a Promise
         * that resolves with the token and other relevant data.
         *
         * @param {string} authorizationCode - The authorization code.
         * @param {string} sessionState - The session state.
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
         *
         * @example
         * ```
         * auth.requestAccessToken(authCode, sessionState).then((token)=>{
         *  // console.log(token);
         * }).catch((error)=>{
         *  // console.error(error);
         * });
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestAccessToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */requestAccessToken(e,i,o,n){return t(this,void 0,void 0,(function*(){return(yield this._dataLayer.getTemporaryDataParameter(y))?this._authenticationCore.requestAccessToken(e,i,o,n):this._authenticationCore.getOIDCProviderMetaData(!1).then((()=>this._authenticationCore.requestAccessToken(e,i,o,n)))}))}
/**
         * This method returns the sign-out URL.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * **This doesn't clear the authentication data.**
         *
         * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
         *
         * @example
         * ```
         * const signOutUrl = await auth.getSignOutURL();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getSignOutURL
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getSignOutURL(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getSignOutURL(e)}))}
/**
         * This method returns OIDC service endpoints that are fetched from the `.well-known` endpoint.
         *
         * @return {Promise<OIDCEndpoints>} - A Promise that resolves with an object containing the OIDC service endpoints.
         *
         * @example
         * ```
         * const endpoints = await auth.getOIDCServiceEndpoints();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getOIDCServiceEndpoints
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getOIDCServiceEndpoints(){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getOIDCServiceEndpoints()}))}
/**
         * This method decodes the payload of the ID token and returns it.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<DecodedIDTokenPayload>} - A Promise that resolves with the decoded ID token payload.
         *
         * @example
         * ```
         * const decodedIdToken = await auth.getDecodedIDToken();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getDecodedIDToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getDecodedIDToken(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getDecodedIDToken(e)}))}
/**
         * This method returns the ID token.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<string>} - A Promise that resolves with the ID token.
         *
         * @example
         * ```
         * const idToken = await auth.getIDToken();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getIDToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getIDToken(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getIDToken(e)}))}
/**
         * This method returns the basic user information obtained from the ID token.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<BasicUserInfo>} - A Promise that resolves with an object containing the basic user information.
         *
         * @example
         * ```
         * const userInfo = await auth.getBasicUserInfo();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getBasicUserInfo
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getBasicUserInfo(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getBasicUserInfo(e)}))}
/**
         * This method returns the crypto helper object.
         *
         * @return {Promise<CryptoHelper>} - A Promise that resolves with a CryptoHelper object.
         *
         * @example
         * ```
         * const cryptoHelper = await auth.CryptoHelper();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getCryptoHelper
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getCryptoHelper(){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getCryptoHelper()}))}
/**
         * This method revokes the access token.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * **This method also clears the authentication data.**
         *
         * @return {Promise<FetchResponse>} - A Promise that returns the response of the revoke-access-token request.
         *
         * @example
         * ```
         * auth.revokeAccessToken().then((response)=>{
         *  // console.log(response);
         * }).catch((error)=>{
         *  // console.error(error);
         * });
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#revokeAccessToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */revokeAccessToken(e){return this._authenticationCore.revokeAccessToken(e)}
/**
         * This method refreshes the access token and returns a Promise that resolves with the new access
         * token and other relevant data.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
         *
         * @example
         * ```
         * auth.refreshAccessToken().then((response)=>{
         *  // console.log(response);
         * }).catch((error)=>{
         *  // console.error(error);
         * });
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#refreshAccessToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */refreshAccessToken(e){return this._authenticationCore.refreshAccessToken(e)}
/**
         * This method returns the access token.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<string>} - A Promise that resolves with the access token.
         *
         * @example
         * ```
         * const accessToken = await auth.getAccessToken();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getAccessToken
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getAccessToken(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getAccessToken(e)}))}
/**
         * This method sends a custom-grant request and returns a Promise that resolves with the response
         * depending on the config passed.
         *
         * @param {CustomGrantConfig} config - A config object containing the custom grant configurations.
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<TokenResponse | FetchResponse>} - A Promise that resolves with the response depending
         * on your configurations.
         *
         * @example
         * ```
         * const config = {
         *   attachToken: false,
         *   data: {
         *       client_id: "{{clientID}}",
         *       grant_type: "account_switch",
         *       scope: "{{scope}}",
         *       token: "{{token}}",
         *   },
         *   id: "account-switch",
         *   returnResponse: true,
         *   returnsSession: true,
         *   signInRequired: true
         * }
         *
         * auth.requestCustomGrant(config).then((response)=>{
         *  // console.log(response);
         * }).catch((error)=>{
         *  // console.error(error);
         * });
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#requestCustomGrant
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */requestCustomGrant(e,t){return this._authenticationCore.requestCustomGrant(e,t)}
/**
         * This method returns if the user is authenticated or not.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @return {Promise<boolean>} - A Promise that resolves with `true` if the user is authenticated, `false` otherwise.
         *
         * @example
         * ```
         * await auth.isAuthenticated();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isAuthenticated
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */isAuthenticated(e){return t(this,void 0,void 0,(function*(){return this._authenticationCore.isAuthenticated(e)}))}
/**
         * This method returns the PKCE code generated during the generation of the authentication URL.
         *
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         * @param {string} state - The state parameter that was passed in the authentication URL.
         *
         * @return {Promise<string>} - A Promise that resolves with the PKCE code.
         *
         * @example
         * ```
         * const pkce = await getPKCECode();
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#getPKCECode
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */getPKCECode(e,i){return t(this,void 0,void 0,(function*(){return this._authenticationCore.getPKCECode(e,i)}))}
/**
         * This method sets the PKCE code to the data store.
         *
         * @param {string} pkce - The PKCE code.
         * @param {string} state - The state parameter that was passed in the authentication URL.
         * @param {string} userID - (Optional) A unique ID of the user to be authenticated. This is useful in multi-user
         * scenarios where each user should be uniquely identified.
         *
         * @example
         * ```
         * await auth.setPKCECode("pkce_code")
         * ```
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#setPKCECode
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */setPKCECode(e,i,o){return t(this,void 0,void 0,(function*(){yield this._authenticationCore.setPKCECode(e,i,o)}))}
/**
         * This method returns if the sign-out is successful or not.
         *
         * @param {string} signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
         *
         * **The server appends path parameters to the `signOutRedirectURL` and these path parameters
         *  are required for this method to function.**
         *
         * @return {boolean} - `true` if successful, `false` otherwise.
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#isSignOutSuccessful
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */static isSignOutSuccessful(e){const t=new URL(e),i=t.searchParams.get(A),o=Boolean(t.searchParams.get("error"));return!!i&&(i===E&&!o)}
/**
         * This method returns if the sign-out has failed or not.
         *
         * @param {string} signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
         *
         * **The server appends path parameters to the `signOutRedirectURL` and these path parameters
         *  are required for this method to function.**
         *
         * @return {boolean} - `true` if successful, `false` otherwise.
         *
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#didSignOutFail
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */static didSignOutFail(e){const t=new URL(e),i=t.searchParams.get(A),o=Boolean(t.searchParams.get("error"));return!!i&&(i===E&&o)}
/**
         * This method updates the configuration that was passed into the constructor when instantiating this class.
         *
         * @param {Partial<AuthClientConfig<T>>} config - A config object to update the SDK configurations with.
         *
         * @example
         * ```
         * const config = {
         *     signInRedirectURL: "http://localhost:3000/sign-in",
         *     clientID: "client ID",
         *     baseUrl: "https://localhost:9443"
         * }
         *
         * await auth.updateConfig(config);
         * ```
         * @link https://github.com/asgardeo/asgardeo-auth-js-sdk/tree/master#updateConfig
         *
         * @memberof AsgardeoAuthClient
         *
         * @preserve
         */updateConfig(e){return t(this,void 0,void 0,(function*(){yield this._authenticationCore.updateConfig(e)}))}static clearUserSessionData(e){return t(this,void 0,void 0,(function*(){yield this._authenticationCore.clearUserSessionData(e)}))}}e.AUTHORIZATION_CODE="code",e.AsgardeoAuthClient=M,e.AsgardeoAuthException=H,e.AuthenticationUtils=K,e.CLIENT_ID_TAG=S,e.CLIENT_SECRET_TAG=C,e.CryptoHelper=j,e.DataLayer=$,e.OIDC_SCOPE=U,e.PKCE_CODE_VERIFIER=I,e.PKCE_SEPARATOR=P,e.REFRESH_TOKEN_TIMER="refresh_token_timer",e.SCOPE_TAG=T,e.SESSION_STATE=w,e.SIGN_OUT_SUCCESS_PARAM=E,e.SIGN_OUT_URL="sign_out_url",e.STATE=A,e.SUPPORTED_SIGNATURE_ALGORITHMS=R,e.TOKEN_TAG=m,e.USERNAME_TAG=k,Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=asgardeo-auth.production.js.map
