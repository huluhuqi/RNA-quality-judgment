import { ENV } from '../config/env';

export function handleError(error, message) {
    if (ENV.isDev) {
        console.error(message, error);
    }
    return {
        success: false,
        message: message,
        error: error
    };
}

export function safeExecute(fn, errorMessage, defaultValue = null) {
    try {
        return {
            success: true,
            result: fn()
        };
    } catch (error) {
        handleError(error, errorMessage);
        return {
            success: false,
            message: errorMessage,
            result: defaultValue
        };
    }
}

export function asyncSafeExecute(fn, errorMessage, defaultValue = null) {
    return fn().then(result => ({
        success: true,
        result
    })).catch(error => {
        handleError(error, errorMessage);
        return {
            success: false,
            message: errorMessage,
            result: defaultValue
        };
    });
}
