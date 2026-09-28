const ssoAuthenticationFlow: 'code' | 'password' = 'code'
let serviceEndpoint = "https://localhost:5001"

export function getServiceUrl() {
    return `${serviceEndpoint}/api/`
}

export const environment = {
    appVersion: '1.0.0',
    production: false,
    ssoAuthenticationFlow
}