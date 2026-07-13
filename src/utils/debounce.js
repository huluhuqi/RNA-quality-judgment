/**
 * 防抖工具函数
 *
 * 用于限制函数的执行频率，避免频繁调用导致性能问题
 */

/**
 * 创建防抖函数
 * 
 * @param {Function} fn 要防抖的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 * 
 * @example
 * const debouncedSearch = debounce(search, 300);
 * input.addEventListener('input', debouncedSearch);
 */
export function debounce(fn, delay = 200) {
    let timer = null;
    
    return function(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * 创建节流函数
 * 
 * @param {Function} fn 要节流的函数
 * @param {number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(fn, limit = 100) {
    let inThrottle = false;
    
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * 创建带立即执行选项的防抖函数
 * 
 * @param {Function} fn 要防抖的函数
 * @param {number} delay 延迟时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function}
 */
export function debounceWithImmediate(fn, delay = 200, immediate = false) {
    let timer = null;
    
    return function(...args) {
        if (immediate && !timer) {
            fn.apply(this, args);
        }
        
        if (timer) {
            clearTimeout(timer);
        }
        
        timer = setTimeout(() => {
            if (!immediate) {
                fn.apply(this, args);
            }
            timer = null;
        }, delay);
    };
}