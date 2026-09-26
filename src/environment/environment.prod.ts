const ssoAuthenticationFlow: 'code' | 'password' = 'code'
// let serviceEndpoint = "http://192.168.2.22:8080";
// let userManagementEndpoint = "http://192.168.2.22:8081";
// let identityEndpoint = "http://192.168.2.22:8082";
// let selfEndpoint = 'http://192.168.2.22:8083'

let serviceEndpoint = "https://localhost:5001";
let userManagementEndpoint = "https://localhost:6001";
let identityEndpoint = "https://localhost:7001";
let selfEndpoint = 'http://localhost:4200'

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