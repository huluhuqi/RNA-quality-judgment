export const ENV = {

    isDev: import.meta.env.DEV,

    isProd: import.meta.env.PROD,

    baseUrl: import.meta.env.BASE_URL || '/RNA-quality-judgment/',

    version: '1.0.0'

};

export function log(message, ...args) {
    if (ENV.isDev) {
        console.log(message, ...args);
    }
}

export function warn(message, ...args) {
    if (ENV.isDev) {
        console.warn(message, ...args);
    }
}

export function error(message, ...args) {
    console.error(message, ...args);
}
