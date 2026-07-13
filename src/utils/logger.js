/**
 * 统一日志输出工具
 *
 * 生产环境禁用 log/debug，保留 error/warn
 * 开发环境全部启用
 *
 * 用法：
 *   import { logger } from '@/utils/logger'
 *   logger.log('debug info')
 *   logger.warn('warning')
 *   logger.error('error')
 */

const isDev = import.meta.env?.DEV ?? false;

export const logger = {
    log(...args) {
        if (isDev) {
            console.log(...args);
        }
    },

    debug(...args) {
        if (isDev) {
            console.debug(...args);
        }
    },

    info(...args) {
        if (isDev) {
            console.info(...args);
        }
    },

    warn(...args) {
        console.warn(...args);
    },

    error(...args) {
        console.error(...args);
    },

    table(...args) {
        if (isDev) {
            console.table(...args);
        }
    },

    group(label) {
        if (isDev) {
            console.group(label);
        }
    },

    groupEnd() {
        if (isDev) {
            console.groupEnd();
        }
    }
};

export default logger;
