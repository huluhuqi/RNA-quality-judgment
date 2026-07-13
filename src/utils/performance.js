/**
 * 性能监控工具
 *
 * 用于分析各环节耗时，定位性能瓶颈
 */

// 是否启用性能监控（生产环境可关闭）
let enabled = false;

/**
 * 启用/禁用性能监控
 * 
 * @param {boolean} value
 */
export function enablePerformanceMonitor(value) {
    enabled = value;
}

/**
 * 创建性能计时器
 * 
 * @param {string} name 计时器名称
 * @returns {Function} 结束计时函数
 * 
 * @example
 * const end = timer('RNA分析')
 * analyzeRNA(sample)
 * end() // 输出: RNA分析 12.5ms
 */
export function timer(name) {
    if (!enabled) {
        return () => {};
    }

    const start = performance.now();
    
    return () => {
        const duration = performance.now() - start;
        console.log(`[性能] ${name}: ${duration.toFixed(2)}ms`);
    };
}

/**
 * 异步性能计时器
 * 
 * @param {string} name 计时器名称
 * @returns {Function} 结束计时函数（返回Promise）
 */
export function asyncTimer(name) {
    if (!enabled) {
        return async () => {};
    }

    const start = performance.now();
    
    return async () => {
        const duration = performance.now() - start;
        console.log(`[性能] ${name}: ${duration.toFixed(2)}ms`);
    };
}

/**
 * 性能测量包装函数
 * 
 * @param {string} name 测量名称
 * @param {Function} fn 要测量的函数
 * @returns {any} 函数执行结果
 */
export function measure(name, fn) {
    if (!enabled) {
        return fn();
    }

    const end = timer(name);
    try {
        const result = fn();
        end();
        return result;
    } catch (error) {
        end();
        throw error;
    }
}

/**
 * 异步性能测量包装函数
 * 
 * @param {string} name 测量名称
 * @param {Function} fn 要测量的异步函数
 * @returns {Promise<any>} 函数执行结果
 */
export async function measureAsync(name, fn) {
    if (!enabled) {
        return fn();
    }

    const end = timer(name);
    try {
        const result = await fn();
        end();
        return result;
    } catch (error) {
        end();
        throw error;
    }
}

/**
 * 批量处理性能优化
 * 
 * 将大量数据分批处理，避免阻塞UI
 * 
 * @param {Array} data 数据数组
 * @param {Function} processor 处理函数
 * @param {number} batchSize 每批数量（默认200）
 * @returns {Promise<Array>} 处理结果
 */
export async function batchProcess(data, processor, batchSize = 200) {
    const results = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const batchResults = batch.map(processor);
        results.push(...batchResults);
        
        // 等待下一个事件循环，让UI有机会更新
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
}

/**
 * 内存使用报告
 */
export function reportMemoryUsage() {
    if (!enabled || !performance.memory) {
        return;
    }
    
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
    
    console.log(`[内存] 已用: ${(usedJSHeapSize / 1024 / 1024).toFixed(2)}MB, ` +
                `总计: ${(totalJSHeapSize / 1024 / 1024).toFixed(2)}MB, ` +
                `限制: ${(jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
}