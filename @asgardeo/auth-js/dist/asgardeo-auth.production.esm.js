function e(e,t,i,n){return new(i||(i=Promise))((function(o,s){function r(e){try{d(n.next(e))}catch(e){s(e)}}function a(e){try{d(n.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(r,a)}d((n=n.apply(e,t||[])).next())}))}var t;!function(e){e.formPost="form_post",e.query="query"}(t||(t={}));const i="/oauth2/authorize",n="/oidc/checksession",o="/oidc/logout",s="/oauth2/token",r="/oauth2/jwks",a="/oauth2/revoke",d="/oauth2/token",c="/oauth2/userinfo",l="{{token}}",u="{{username}}",h="{{scope}}",v="{{clientID}}",p="{{clientSecret}}";var _;!function(e){e.ConfigData="config_data",e.OIDCProviderMetaData="oidc_provider_meta_data",e.SessionData="session_data",e.TemporaryData="temporary_data"}(_||(_={}));const y="refresh_token_timer",f="pkce_code_verifier",g="#",D=["RS256","RS512","RS384","PS256"],k="code",m="session_state",T="sign_out_url",C="sign_out_success",S="state",O="openid";var I;!function(e){e.Include="include",e.SameOrigin="same-origin",e.Omit="omit"}(I||(I={}));class w{constructor(e,t,i){this.message=i,this.name=t,this.code=e,Object.setPrototypeOf(this,new.target.prototype)}}class P{constructor(){}static filterClaimsFromIDTokenPayload(e){const t=Object.assign({},e);null==t||delete t.iss,null==t||delete t.aud,null==t||delete t.exp,null==t||delete t.iat,null==t||delete t.acr,null==t||delete t.amr,null==t||delete t.azp,null==t||delete t.auth_time,null==t||delete t.nonce,null==t||delete t.c_hash,null==t||delete t.at_hash,null==t||delete t.nbf,null==t||delete t.isk,null==t||delete t.sid;const i={};return Object.entries(t).forEach((([e,t])=>{const n=e.split("_").map(((e,t)=>0===t?e:[e[0].toUpperCase(),...e.slice(1)].join(""))).join("");i[n]=t})),i}static getTokenRequestHeaders(){return{Accept:"application/json","Content-Type":"application/x-www-form-urlencoded"}}static generateStateParamForRequestCorrelation(e,t){const i=parseInt(e.split("#")[1]);return t?`${t}_request_${i}`:`request_${i}`}static extractPKCEKeyFromStateParam(e){return`pkce_code_verifier#${parseInt(e.split("request_")[1])}`}}P.getTenantDomainFromIdTokenPayload=(e,t="@")=>{const i=e.sub.split(t);return i.length>2?i[i.length-1]:""};class R{constructor(t,i){this._dataLayer=t,this._config=()=>e(this,void 0,void 0,(function*(){return yield this._dataLayer.getConfigData()})),this._oidcProviderMetaData=()=>e(this,void 0,void 0,(function*(){return yield this._dataLayer.getOIDCProviderMetaData()})),this._cryptoHelper=i}resolveEndpoints(t){return e(this,void 0,void 0,(function*(){const e={},i=yield this._config();return i.endpoints&&Object.keys(i.endpoints).forEach((t=>{const n=t.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));e[n]=(null==i?void 0:i.endpoints)?i.endpoints[t]:""})),Object.assign(Object.assign({},t),e)}))}resolveEndpointsExplicitly(){return e(this,void 0,void 0,(function*(){const e={},t=yield this._config(),i=["authorization_endpoint","end_session_endpoint","jwks_uri","check_session_iframe","revocation_endpoint","token_endpoint","issuer","userinfo_endpoint"];if(!(!!t.endpoints&&Object.keys(null==t?void 0:t.endpoints).every((e=>{const t=e.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));return i.includes(t)}))))throw new w("JS-AUTH_HELPER-REE-NF01","No required endpoints.","Required oidc endpoints are not defined");return t.endpoints&&Object.keys(t.endpoints).forEach((i=>{const n=i.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));e[n]=(null==t?void 0:t.endpoints)?t.endpoints[i]:""})),Object.assign({},e)}))}resolveEndpointsByBaseURL(){return e(this,void 0,void 0,(function*(){const e={},t=yield this._config(),l=t.baseUrl;if(!l)throw new w("JS-AUTH_HELPER_REBO-NF01","Base URL not defined.","Base URL is not defined in AuthClient config.");t.endpoints&&Object.keys(t.endpoints).forEach((i=>{const n=i.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));e[n]=(null==t?void 0:t.endpoints)?t.endpoints[i]:""}));const u={authorization_endpoint:`${l}${i}`,end_session_endpoint:`${l}${o}`,issuer:`${l}${s}`,jwks_uri:`${l}${r}`,check_session_iframe:`${l}${n}`,revocation_endpoint:`${l}${a}`,token_endpoint:`${l}${d}`,userinfo_endpoint:`${l}${c}`};return Object.assign(Object.assign({},u),e)}))}validateIdToken(t){return e(this,void 0,void 0,(function*(){const e=(yield this._dataLayer.getOIDCProviderMetaData()).jwks_uri,i=yield this._config();if(!e||0===e.trim().length)throw new w("JS_AUTH_HELPER-VIT-NF01","JWKS endpoint not found.","No JWKS endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the JWKS endpoint passed to the SDK is empty.");let n;try{n=yield fetch(e,{credentials:i.sendCookiesInRequests?I.Include:I.SameOrigin})}catch(e){throw new w("JS-AUTH_HELPER-VIT-NE02","Request to jwks endpoint failed.",null!=e?e:"The request sent to get the jwks from the server failed.")}if(200!==n.status||!n.ok)throw new w("JS-AUTH_HELPER-VIT-HE03",`Invalid response status received for jwks request (${n.statusText}).`,yield n.json());const o=(yield this._oidcProviderMetaData()).issuer,{keys:s}=yield n.json(),r=yield this._cryptoHelper.getJWKForTheIdToken(t.split(".")[0],s);return this._cryptoHelper.isValidIdToken(t,r,(yield this._config()).clientID,null!=o?o:"",this._cryptoHelper.decodeIDToken(t).sub,(yield this._config()).clockTolerance)}))}getAuthenticatedUserInfo(e){var t,i,n,o;const s=this._cryptoHelper.decodeIDToken(e),r=P.getTenantDomainFromIdTokenPayload(s),a=null!==(t=null==s?void 0:s.username)&&void 0!==t?t:"",d=null!==(i=s.given_name)&&void 0!==i?i:"",c=null!==(n=s.family_name)&&void 0!==n?n:"",l=d&&c?`${d} ${c}`:d||(c||""),u=null!==(o=s.preferred_username)&&void 0!==o?o:l;return Object.assign({displayName:u,tenantDomain:r,username:a},P.filterClaimsFromIDTokenPayload(s))}replaceCustomGrantTemplateTags(t,i){var n;return e(this,void 0,void 0,(function*(){let e="openid";const o=yield this._config(),s=yield this._dataLayer.getSessionData(i);return o.scope&&o.scope.length>0&&(o.scope.includes("openid")||o.scope.push("openid"),e=o.scope.join(" ")),t.replace("{{token}}",s.access_token).replace("{{username}}",this.getAuthenticatedUserInfo(s.id_token).username).replace("{{scope}}",e).replace("{{clientID}}",o.clientID).replace("{{clientSecret}}",null!==(n=o.clientSecret)&&void 0!==n?n:"")}))}clearUserSessionData(t){return e(this,void 0,void 0,(function*(){yield this._dataLayer.removeTemporaryData(t),yield this._dataLayer.removeSessionData(t)}))}handleTokenResponse(t,i){return e(this,void 0,void 0,(function*(){if(200!==t.status||!t.ok)throw new w("JS-AUTH_HELPER-HTR-NE01",`Invalid response status received for token request (${t.statusText}).`,yield t.json());const n=yield t.json();if(n.created_at=(new Date).getTime(),(yield this._config()).validateIDToken)return this.validateIdToken(n.id_token).then((()=>e(this,void 0,void 0,(function*(){yield this._dataLayer.setSessionData(n,i);const e={accessToken:n.access_token,createdAt:n.created_at,expiresIn:n.expires_in,idToken:n.id_token,refreshToken:n.refresh_token,scope:n.scope,tokenType:n.token_type};return Promise.resolve(e)}))));{const e={accessToken:n.access_token,createdAt:n.created_at,expiresIn:n.expires_in,idToken:n.id_token,refreshToken:n.refresh_token,scope:n.scope,tokenType:n.token_type};return yield this._dataLayer.setSessionData(n,i),Promise.resolve(e)}}))}generatePKCEKey(t){var i;return e(this,void 0,void 0,(function*(){const e=yield this._dataLayer.getTemporaryData(t),n=[];Object.keys(e).forEach((e=>{e.startsWith("pkce_code_verifier")&&n.push(e)}));const o=n.sort().pop();return`pkce_code_verifier#${parseInt(null!==(i=null==o?void 0:o.split("#")[1])&&void 0!==i?i:"-1")+1}`}))}}class E{constructor(e){this._cryptoUtils=e}getCodeVerifier(){return this._cryptoUtils.base64URLEncode(this._cryptoUtils.generateRandomBytes(32))}getCodeChallenge(e){return this._cryptoUtils.base64URLEncode(this._cryptoUtils.hashSha256(e))}getJWKForTheIdToken(e,t){const i=JSON.parse(this._cryptoUtils.base64URLDecode(e));for(const e of t)if(i.kid===e.kid)return e;throw new w("JS-CRYPTO_UTIL-GJFTIT-IV01","kid not found.","Failed to find the 'kid' specified in the id_token. 'kid' found in the header : "+i.kid+", Expected values: "+t.map((e=>e.kid)).join(", "))}isValidIdToken(e,t,i,n,o,s){return this._cryptoUtils.verifyJwt(e,t,D,i,n,o,s).then((e=>e?Promise.resolve(!0):Promise.reject(new w("JS-CRYPTO_HELPER-IVIT-IV01","Invalid ID token.","ID token validation returned false"))))}decodeIDToken(e){try{const t=this._cryptoUtils.base64URLDecode(e.split(".")[1]);return JSON.parse(t)}catch(e){throw new w("JS-CRYPTO_UTIL-DIT-IV01","Decoding ID token failed.",e)}}}class L{constructor(t,i){this._cryptoUtils=i,this._cryptoHelper=new E(i),this._authenticationHelper=new R(t,this._cryptoHelper),this._dataLayer=t,this._config=()=>e(this,void 0,void 0,(function*(){return yield this._dataLayer.getConfigData()})),this._oidcProviderMetaData=()=>e(this,void 0,void 0,(function*(){return yield this._dataLayer.getOIDCProviderMetaData()}))}getAuthorizationURL(t,i){var n,o,s;return e(this,void 0,void 0,(function*(){const e=yield this._dataLayer.getOIDCProviderMetaDataParameter("authorization_endpoint"),r=yield this._config();if(!e||0===e.trim().length)throw new w("JS-AUTH_CORE-GAU-NF01","No authorization endpoint found.","No authorization endpoint was found in the OIDC provider meta data from the well-known endpoint or the authorization endpoint passed to the SDK is empty.");const a=new URL(e),d=new Map;d.set("response_type","code"),d.set("client_id",r.clientID);let c="openid";r.scope&&r.scope.length>0&&(r.scope.includes("openid")||r.scope.push("openid"),c=r.scope.join(" ")),d.set("scope",c),d.set("redirect_uri",r.signInRedirectURL),r.responseMode&&d.set("response_mode",r.responseMode);const l=yield this._authenticationHelper.generatePKCEKey(i);if(r.enablePKCE){const e=null===(n=this._cryptoHelper)||void 0===n?void 0:n.getCodeVerifier(),t=null===(o=this._cryptoHelper)||void 0===o?void 0:o.getCodeChallenge(e);yield this._dataLayer.setTemporaryDataParameter(l,e,i),d.set("code_challenge_method","S256"),d.set("code_challenge",t)}r.prompt&&d.set("prompt",r.prompt);const u=t;if(u)for(const[e,t]of Object.entries(u))if(""!=e&&""!=t&&"state"!==e){const i=e.replace(/[A-Z]/g,(e=>`_${e.toLowerCase()}`));d.set(i,t.toString())}d.set("state",P.generateStateParamForRequestCorrelation(l,u?null===(s=u.state)||void 0===s?void 0:s.toString():""));for(const[e,t]of d.entries())a.searchParams.append(e,t);return a.toString()}))}requestAccessToken(t,i,n,o){return e(this,void 0,void 0,(function*(){const e=(yield this._oidcProviderMetaData()).token_endpoint,s=yield this._config();if(!e||0===e.trim().length)throw new w("JS-AUTH_CORE-RAT1-NF01","Token endpoint not found.","No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the token endpoint passed to the SDK is empty.");i&&(yield this._dataLayer.setSessionDataParameter("session_state",i,o));const r=[];r.push(`client_id=${s.clientID}`),s.clientSecret&&s.clientSecret.trim().length>0&&r.push(`client_secret=${s.clientSecret}`);const a=t;let d;r.push(`code=${a}`),r.push("grant_type=authorization_code"),r.push(`redirect_uri=${s.signInRedirectURL}`),s.enablePKCE&&(r.push(`code_verifier=${yield this._dataLayer.getTemporaryDataParameter(P.extractPKCEKeyFromStateParam(n),o)}`),yield this._dataLayer.removeTemporaryDataParameter(P.extractPKCEKeyFromStateParam(n),o));try{d=yield fetch(e,{body:r.join("&"),credentials:s.sendCookiesInRequests?I.Include:I.SameOrigin,headers:new Headers(P.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new w("JS-AUTH_CORE-RAT1-NE02","Requesting access token failed",null!=e?e:"The request to get the access token from the server failed.")}if(!d.ok)throw new w("JS-AUTH_CORE-RAT1-HE03",`Requesting access token failed with ${d.statusText}`,yield d.json());return yield this._authenticationHelper.handleTokenResponse(d,o)}))}refreshAccessToken(t){return e(this,void 0,void 0,(function*(){const e=(yield this._oidcProviderMetaData()).token_endpoint,i=yield this._config(),n=yield this._dataLayer.getSessionData(t);if(!n.refresh_token)throw new w("JS-AUTH_CORE-RAT2-NF01","No refresh token found.","There was no refresh token found. Asgardeo doesn't return a refresh token if the refresh token grant is not enabled.");if(!e||0===e.trim().length)throw new w("JS-AUTH_CORE-RAT2-NF02","No refresh token endpoint found.","No refresh token endpoint was in the OIDC provider meta data returned by the well-known endpoint or the refresh token endpoint passed to the SDK is empty.");const o=[];let s;o.push(`client_id=${i.clientID}`),o.push(`refresh_token=${n.refresh_token}`),o.push("grant_type=refresh_token"),i.clientSecret&&i.clientSecret.trim().length>0&&o.push(`client_secret=${i.clientSecret}`);try{s=yield fetch(e,{body:o.join("&"),credentials:i.sendCookiesInRequests?I.Include:I.SameOrigin,headers:new Headers(P.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new w("JS-AUTH_CORE-RAT2-NR03","Refresh access token request failed.",null!=e?e:"The request to refresh the access token failed.")}if(!s.ok)throw new w("JS-AUTH_CORE-RAT2-HE04",`Refreshing access token failed with ${s.statusText}`,yield s.json());return this._authenticationHelper.handleTokenResponse(s,t)}))}revokeAccessToken(t){return e(this,void 0,void 0,(function*(){const e=(yield this._oidcProviderMetaData()).revocation_endpoint,i=yield this._config();if(!e||0===e.trim().length)throw new w("JS-AUTH_CORE-RAT3-NF01","No revoke access token endpoint found.","No revoke access token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the revoke access token endpoint passed to the SDK is empty.");const n=[];let o;n.push(`client_id=${i.clientID}`),n.push(`token=${(yield this._dataLayer.getSessionData(t)).access_token}`),n.push("token_type_hint=access_token");try{o=yield fetch(e,{body:n.join("&"),credentials:i.sendCookiesInRequests?I.Include:I.SameOrigin,headers:new Headers(P.getTokenRequestHeaders()),method:"POST"})}catch(e){throw new w("JS-AUTH_CORE-RAT3-NE02","The request to revoke access token failed.",null!=e?e:"The request sent to revoke the access token failed.")}if(200!==o.status||!o.ok)throw new w("JS-AUTH_CORE-RAT3-HE03",`Invalid response status received for revoke access token request (${o.statusText}).`,yield o.json());return this._authenticationHelper.clearUserSessionData(t),Promise.resolve(o)}))}requestCustomGrant(t,i){return e(this,void 0,void 0,(function*(){const n=yield this._oidcProviderMetaData(),o=yield this._config();let s;if(s=t.tokenEndpoint&&0!==t.tokenEndpoint.trim().length?t.tokenEndpoint:n.token_endpoint,!s||0===s.trim().length)throw new w("JS-AUTH_CORE-RCG-NF01","Token endpoint not found.","No token endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the token endpoint passed to the SDK is empty.");const r=yield Promise.all(Object.entries(t.data).map((([t,n])=>e(this,void 0,void 0,(function*(){const e=yield this._authenticationHelper.replaceCustomGrantTemplateTags(n,i);return`${t}=${e}`})))));let a=Object.assign({},P.getTokenRequestHeaders());t.attachToken&&(a=Object.assign(Object.assign({},a),{Authorization:`Bearer ${(yield this._dataLayer.getSessionData(i)).access_token}`}));const d={body:r.join("&"),credentials:o.sendCookiesInRequests?I.Include:I.SameOrigin,headers:new Headers(a),method:"POST"};let c;try{c=yield fetch(s,d)}catch(e){throw new w("JS-AUTH_CORE-RCG-NE02","The custom grant request failed.",null!=e?e:"The request sent to get the custom grant failed.")}if(200!==c.status||!c.ok)throw new w("JS-AUTH_CORE-RCG-HE03",`Invalid response status received for the custom grant request. (${c.statusText})`,yield c.json());return t.returnsSession?this._authenticationHelper.handleTokenResponse(c,i):Promise.resolve(yield c.json())}))}getBasicUserInfo(t){return e(this,void 0,void 0,(function*(){const e=yield this._dataLayer.getSessionData(t),i=this._authenticationHelper.getAuthenticatedUserInfo(null==e?void 0:e.id_token);let n={allowedScopes:e.scope,sessionState:e.session_state};return Object.keys(i).forEach((e=>{void 0!==i[e]&&""!==i[e]&&null!==i[e]||delete i[e]})),n=Object.assign(Object.assign({},n),i),n}))}getDecodedIDToken(t){return e(this,void 0,void 0,(function*(){const e=(yield this._dataLayer.getSessionData(t)).id_token;return this._cryptoHelper.decodeIDToken(e)}))}getCryptoHelper(){return e(this,void 0,void 0,(function*(){return this._cryptoHelper}))}getIDToken(t){return e(this,void 0,void 0,(function*(){return(yield this._dataLayer.getSessionData(t)).id_token}))}getOIDCProviderMetaData(t){return e(this,void 0,void 0,(function*(){const e=yield this._config();if(!t&&(yield this._dataLayer.getTemporaryDataParameter("op_config_initiated")))return Promise.resolve();const i=e.wellKnownEndpoint;if(i){let e;try{if(e=yield fetch(i),200!==e.status||!e.ok)throw new Error}catch(e){throw new w("JS-AUTH_CORE-GOPMD-HE01","Invalid well-known response","The well known endpoint response has been failed with an error.")}return yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpoints(yield e.json())),yield this._dataLayer.setTemporaryDataParameter("op_config_initiated",!0),Promise.resolve()}if(e.baseUrl){try{yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsByBaseURL())}catch(e){throw new w("JS-AUTH_CORE-GOPMD-IV02","Resolving endpoints failed.",null!=e?e:"Resolving endpoints by base url failed.")}return yield this._dataLayer.setTemporaryDataParameter("op_config_initiated",!0),Promise.resolve()}try{yield this._dataLayer.setOIDCProviderMetaData(yield this._authenticationHelper.resolveEndpointsExplicitly())}catch(e){throw new w("JS-AUTH_CORE-GOPMD-IV03","Resolving endpoints failed.",null!=e?e:"Resolving endpoints by explicitly failed.")}return yield this._dataLayer.setTemporaryDataParameter("op_config_initiated",!0),Promise.resolve()}))}getOIDCServiceEndpoints(){var t,i,n,o,s,r,a,d,c,l;return e(this,void 0,void 0,(function*(){const e=yield this._oidcProviderMetaData();return{authorizationEndpoint:null!==(t=e.authorization_endpoint)&&void 0!==t?t:"",checkSessionIframe:null!==(i=e.check_session_iframe)&&void 0!==i?i:"",endSessionEndpoint:null!==(n=e.end_session_endpoint)&&void 0!==n?n:"",introspectionEndpoint:null!==(o=e.introspection_endpoint)&&void 0!==o?o:"",issuer:null!==(s=e.issuer)&&void 0!==s?s:"",jwksUri:null!==(r=e.jwks_uri)&&void 0!==r?r:"",registrationEndpoint:null!==(a=e.registration_endpoint)&&void 0!==a?a:"",revocationEndpoint:null!==(d=e.revocation_endpoint)&&void 0!==d?d:"",tokenEndpoint:null!==(c=e.token_endpoint)&&void 0!==c?c:"",userinfoEndpoint:null!==(l=e.userinfo_endpoint)&&void 0!==l?l:""}}))}getSignOutURL(t){var i,n,o;return e(this,void 0,void 0,(function*(){const e=null===(i=yield this._oidcProviderMetaData())||void 0===i?void 0:i.end_session_endpoint,s=yield this._config();if(!e||0===e.trim().length)throw new w("JS-AUTH_CORE-GSOU-NF01","Sign-out endpoint not found.","No sign-out endpoint was found in the OIDC provider meta data returned by the well-known endpoint or the sign-out endpoint passed to the SDK is empty.");const r=null===(n=yield this._dataLayer.getSessionData(t))||void 0===n?void 0:n.id_token;if(!r||0===r.trim().length)throw new w("JS-AUTH_CORE-GSOU-NF02","ID token not found.","No ID token could be found. Either the session information is lost or you have not signed in.");const a=null!==(o=null==s?void 0:s.signOutRedirectURL)&&void 0!==o?o:null==s?void 0:s.signInRedirectURL;if(!a||0===a.trim().length)throw new w("JS-AUTH_CORE-GSOU-NF03","No sign-out redirect URL found.","The sign-out redirect URL cannot be found or the URL passed to the SDK is empty. No sign-in redirect URL has been found either. ");return`${e}?id_token_hint=${r}&post_logout_redirect_uri=${a}&state=sign_out_success`}))}clearUserSessionData(t){return e(this,void 0,void 0,(function*(){yield this._authenticationHelper.clearUserSessionData(t)}))}getAccessToken(t){var i;return e(this,void 0,void 0,(function*(){return null===(i=yield this._dataLayer.getSessionData(t))||void 0===i?void 0:i.access_token}))}isAuthenticated(t){return e(this,void 0,void 0,(function*(){return Boolean(yield this.getAccessToken(t))}))}getPKCECode(t,i){return e(this,void 0,void 0,(function*(){return yield this._dataLayer.getTemporaryDataParameter(P.extractPKCEKeyFromStateParam(t),i)}))}setPKCECode(t,i,n){return e(this,void 0,void 0,(function*(){return yield this._dataLayer.setTemporaryDataParameter(P.extractPKCEKeyFromStateParam(i),t,n)}))}updateConfig(t){return e(this,void 0,void 0,(function*(){yield this._dataLayer.setConfigData(t),yield this.getOIDCProviderMetaData(!0)}))}}class U{constructor(e,t){this._id=e,this._store=t}setDataInBulk(t,i){var n;return e(this,void 0,void 0,(function*(){const e=null!==(n=yield this._store.getData(t))&&void 0!==n?n:null,o=e&&JSON.parse(e),s=Object.assign(Object.assign({},o),i),r=JSON.stringify(s);yield this._store.setData(t,r)}))}setValue(t,i,n){var o;return e(this,void 0,void 0,(function*(){const e=null!==(o=yield this._store.getData(t))&&void 0!==o?o:null,s=e&&JSON.parse(e),r=Object.assign(Object.assign({},s),{[i]:n}),a=JSON.stringify(r);yield this._store.setData(t,a)}))}removeValue(t,i){var n;return e(this,void 0,void 0,(function*(){const e=null!==(n=yield this._store.getData(t))&&void 0!==n?n:null,o=e&&JSON.parse(e),s=Object.assign({},o);delete s[i];const r=JSON.stringify(s);yield this._store.setData(t,r)}))}_resolveKey(e,t){return t?`${e}-${this._id}-${t}`:`${e}-${this._id}`}setConfigData(t){return e(this,void 0,void 0,(function*(){yield this.setDataInBulk(this._resolveKey(_.ConfigData),t)}))}setOIDCProviderMetaData(t){return e(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(_.OIDCProviderMetaData),t)}))}setTemporaryData(t,i){return e(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(_.TemporaryData,i),t)}))}setSessionData(t,i){return e(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(_.SessionData,i),t)}))}setCustomData(t,i,n){return e(this,void 0,void 0,(function*(){this.setDataInBulk(this._resolveKey(t,n),i)}))}getConfigData(){var t;return e(this,void 0,void 0,(function*(){return JSON.parse(null!==(t=yield this._store.getData(this._resolveKey(_.ConfigData)))&&void 0!==t?t:null)}))}getOIDCProviderMetaData(){var t;return e(this,void 0,void 0,(function*(){return JSON.parse(null!==(t=yield this._store.getData(this._resolveKey(_.OIDCProviderMetaData)))&&void 0!==t?t:null)}))}getTemporaryData(t){var i;return e(this,void 0,void 0,(function*(){return JSON.parse(null!==(i=yield this._store.getData(this._resolveKey(_.TemporaryData,t)))&&void 0!==i?i:null)}))}getSessionData(t){var i;return e(this,void 0,void 0,(function*(){return JSON.parse(null!==(i=yield this._store.getData(this._resolveKey(_.SessionData,t)))&&void 0!==i?i:null)}))}getCustomData(t,i){var n;return e(this,void 0,void 0,(function*(){return JSON.parse(null!==(n=yield this._store.getData(this._resolveKey(t,i)))&&void 0!==n?n:null)}))}removeConfigData(){return e(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(_.ConfigData))}))}removeOIDCProviderMetaData(){return e(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(_.OIDCProviderMetaData))}))}removeTemporaryData(t){return e(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(_.TemporaryData,t))}))}removeSessionData(t){return e(this,void 0,void 0,(function*(){yield this._store.removeData(this._resolveKey(_.SessionData,t))}))}getConfigDataParameter(t){return e(this,void 0,void 0,(function*(){const e=yield this._store.getData(this._resolveKey(_.ConfigData));return e&&JSON.parse(e)[t]}))}getOIDCProviderMetaDataParameter(t){return e(this,void 0,void 0,(function*(){const e=yield this._store.getData(this._resolveKey(_.OIDCProviderMetaData));return e&&JSON.parse(e)[t]}))}getTemporaryDataParameter(t,i){return e(this,void 0,void 0,(function*(){const e=yield this._store.getData(this._resolveKey(_.TemporaryData,i));return e&&JSON.parse(e)[t]}))}getSessionDataParameter(t,i){return e(this,void 0,void 0,(function*(){const e=yield this._store.getData(this._resolveKey(_.SessionData,i));return e&&JSON.parse(e)[t]}))}setConfigDataParameter(t,i){return e(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(_.ConfigData),t,i)}))}setOIDCProviderMetaDataParameter(t,i){return e(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(_.OIDCProviderMetaData),t,i)}))}setTemporaryDataParameter(t,i,n){return e(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(_.TemporaryData,n),t,i)}))}setSessionDataParameter(t,i,n){return e(this,void 0,void 0,(function*(){yield this.setValue(this._resolveKey(_.SessionData,n),t,i)}))}removeConfigDataParameter(t){return e(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(_.ConfigData),t)}))}removeOIDCProviderMetaDataParameter(t){return e(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(_.OIDCProviderMetaData),t)}))}removeTemporaryDataParameter(t,i){return e(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(_.TemporaryData,i),t)}))}removeSessionDataParameter(t,i){return e(this,void 0,void 0,(function*(){yield this.removeValue(this._resolveKey(_.SessionData,i),t)}))}}const H={clockTolerance:300,enablePKCE:!0,responseMode:t.query,scope:["openid"],sendCookiesInRequests:!0,validateIDToken:!0};class A{
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
constructor(e,t){A._instanceID?A._instanceID+=1:A._instanceID=0,this._dataLayer=new U(`instance_${A._instanceID}`,e),this._authenticationCore=new L(this._dataLayer,t),A._authenticationCore=new L(this._dataLayer,t)}
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
     */initialize(t){var i,n,o;return e(this,void 0,void 0,(function*(){yield this._dataLayer.setConfigData(Object.assign(Object.assign(Object.assign({},H),t),{scope:[...null!==(i=H.scope)&&void 0!==i?i:[],...null!==(o=null===(n=t.scope)||void 0===n?void 0:n.filter((e=>{var t;return!(null===(t=null==H?void 0:H.scope)||void 0===t?void 0:t.includes(e))})))&&void 0!==o?o:[]]}))}))}
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
     */getAuthorizationURL(t,i){return e(this,void 0,void 0,(function*(){const e=Object.assign({},t);return null==e||delete e.forceInit,(yield this._dataLayer.getTemporaryDataParameter("op_config_initiated"))?this._authenticationCore.getAuthorizationURL(e,i):this._authenticationCore.getOIDCProviderMetaData(null==t?void 0:t.forceInit).then((()=>this._authenticationCore.getAuthorizationURL(e,i)))}))}
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
     */requestAccessToken(t,i,n,o){return e(this,void 0,void 0,(function*(){return(yield this._dataLayer.getTemporaryDataParameter("op_config_initiated"))?this._authenticationCore.requestAccessToken(t,i,n,o):this._authenticationCore.getOIDCProviderMetaData(!1).then((()=>this._authenticationCore.requestAccessToken(t,i,n,o)))}))}
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
     */getSignOutURL(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getSignOutURL(t)}))}
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
     */getOIDCServiceEndpoints(){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getOIDCServiceEndpoints()}))}
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
     */getDecodedIDToken(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getDecodedIDToken(t)}))}
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
     */getIDToken(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getIDToken(t)}))}
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
     */getBasicUserInfo(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getBasicUserInfo(t)}))}
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
     */getCryptoHelper(){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getCryptoHelper()}))}
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
     */getAccessToken(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getAccessToken(t)}))}
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
     */isAuthenticated(t){return e(this,void 0,void 0,(function*(){return this._authenticationCore.isAuthenticated(t)}))}
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
     */getPKCECode(t,i){return e(this,void 0,void 0,(function*(){return this._authenticationCore.getPKCECode(t,i)}))}
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
     */setPKCECode(t,i,n){return e(this,void 0,void 0,(function*(){yield this._authenticationCore.setPKCECode(t,i,n)}))}
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
     */static isSignOutSuccessful(e){const t=new URL(e),i=t.searchParams.get("state"),n=Boolean(t.searchParams.get("error"));return!!i&&("sign_out_success"===i&&!n)}
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
     */static didSignOutFail(e){const t=new URL(e),i=t.searchParams.get("state"),n=Boolean(t.searchParams.get("error"));return!!i&&("sign_out_success"===i&&n)}
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
     */updateConfig(t){return e(this,void 0,void 0,(function*(){yield this._authenticationCore.updateConfig(t)}))}static clearUserSessionData(t){return e(this,void 0,void 0,(function*(){yield this._authenticationCore.clearUserSessionData(t)}))}}export{k as AUTHORIZATION_CODE,A as AsgardeoAuthClient,w as AsgardeoAuthException,P as AuthenticationUtils,v as CLIENT_ID_TAG,p as CLIENT_SECRET_TAG,E as CryptoHelper,U as DataLayer,O as OIDC_SCOPE,f as PKCE_CODE_VERIFIER,g as PKCE_SEPARATOR,y as REFRESH_TOKEN_TIMER,t as ResponseMode,h as SCOPE_TAG,m as SESSION_STATE,C as SIGN_OUT_SUCCESS_PARAM,T as SIGN_OUT_URL,S as STATE,D as SUPPORTED_SIGNATURE_ALGORITHMS,_ as Stores,l as TOKEN_TAG,u as USERNAME_TAG};
//# sourceMappingURL=asgardeo-auth.production.esm.js.map
