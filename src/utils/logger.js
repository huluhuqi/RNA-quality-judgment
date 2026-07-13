/**
 * 日志工具
 *
 * 生产环境自动静默 console.log，仅保留 error
 * 开发环境正常输出所有日志
 */

const isDev = import.meta.env?.DEV ?? false;

/**
 * 普通日志（仅开发环境输出）
 */
export function log(...args) {
    if (isDev) {
        console.log(...args);
    }
}

/**
 * 警告日志（仅开发环境输出）
 */
export function warn(...args) {
    if (isDev) {
        console.warn(...args);
    }
}

/**
 * 错误日志（始终输出）
 */
export function error(...args) {
    console.error(...args);
}

/**
 * 调试日志（仅开发环境输出）
 */
export function debug(...args) {
    if (isDev) {
        console.debug(...args);
    }
}

export default { log, warn, error, debug };