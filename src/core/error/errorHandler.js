import { ErrorType } from "./errorType";
import { logError } from "./errorLogger";

export function handleError(error, type = ErrorType.UNKNOWN, context = "") {
    const errorInfo = {
        type,
        message: error.message || String(error),
        context,
        time: new Date().toISOString(),
        stack: error.stack || null
    };

    console.error("[RNA-QC Error]", errorInfo);

    logError(errorInfo);

    return errorInfo;
}

export function wrapAsync(fn, type = ErrorType.UNKNOWN, context = "") {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (e) {
            handleError(e, type, context);
            throw e;
        }
    };
}

export function wrapSync(fn, type = ErrorType.UNKNOWN, context = "") {
    return (...args) => {
        try {
            return fn(...args);
        } catch (e) {
            handleError(e, type, context);
            throw e;
        }
    };
}