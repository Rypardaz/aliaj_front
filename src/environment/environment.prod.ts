const ssoAuthenticationFlow: 'code' | 'password' = 'code'
let serviceEndpoint = "http://192.168.2.21:8080";
let userManagementEndpoint = "http://192.168.2.21:8081";
let identityEndpoint = "http://192.168.2.21:8082";
let selfEndpoint = 'http://192.168.2.21:8083'

export function getServiceUrl() {
    return `${serviceEndpoint}/api/`;
}

export function getUserManagementUrl() {
    return `${userManagementEndpoint}/api/`;
}

export function getIdentityUrl() {
    return `${identityEndpoint}/api/`;
}

export function getLoginUrl() {
    return `${identityEndpoint}/connect/token`;
}

export const environment = {
    appVersion: '1.0.0',
    production: true,
    identityEndpoint,
    selfEndpoint,
    ssoAuthenticationFlow
}