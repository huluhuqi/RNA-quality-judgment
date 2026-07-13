/**
 * 分块处理工具
 *
 * 将大批量数据分块处理，避免阻塞主线程
 * 适用于 Excel 导入、分析、导出等场景
 */

/**
 * 延迟函数（让出主线程）
 * 
 * @param {number} ms 延迟毫秒数（默认0，即下一个事件循环）
 * @returns {Promise<void>}
 */
export function delay(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 分块处理数组
 * 
 * @param {Array} list 要处理的数组
 * @param {Function} handler 处理函数 (chunk, startIndex) => void | Promise
 * @param {number} chunkSize 每块大小（默认200）
 * @param {Function} onProgress 进度回调 (processed, total) => void
 * @returns {Promise<void>}
 * 
 * @example
 * await processChunk(samples, async (chunk, start) => {
 *     chunk.forEach(sample => analyze(sample));
 *     await delay(0); // 让出主线程
 * }, 200, (processed, total) => {
 *     console.log(`进度: ${processed}/${total}`);
 * });
 */
export async function processChunk(list, handler, chunkSize = 200, onProgress = null) {
    const total = list.length;
    
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize);
        await handler(chunk, i);
        
        if (onProgress) {
            onProgress(Math.min(i + chunkSize, total), total);
        }
        
        // 让出主线程，让 UI 有机会更新
        await delay(0);
    }
}

/**
 * 分块处理并收集结果
 * 
 * @param {Array} list 要处理的数组
 * @param {Function} mapper 映射函数 (item, index) => result
 * @param {number} chunkSize 每块大小（默认200）
 * @param {Function} onProgress 进度回调
 * @returns {Promise<Array>} 处理后的结果数组
 */
export async function mapChunk(list, mapper, chunkSize = 200, onProgress = null) {
    const results = [];
    const total = list.length;
    
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize);
        
        for (let j = 0; j < chunk.length; j++) {
            const result = mapper(chunk[j], i + j);
            results.push(result);
        }
        
        if (onProgress) {
            onProgress(Math.min(i + chunkSize, total), total);
        }
        
        await delay(0);
    }
    
    return results;
}

/**
 * 分块过滤
 * 
 * @param {Array} list 要过滤的数组
 * @param {Function} predicate 过滤条件
 * @param {number} chunkSize 每块大小
 * @param {Function} onProgress 进度回调
 * @returns {Promise<Array>}
 */
export async function filterChunk(list, predicate, chunkSize = 200, onProgress = null) {
    const results = [];
    const total = list.length;
    
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize);
        const filtered = chunk.filter(predicate);
        results.push(...filtered);
        
        if (onProgress) {
            onProgress(Math.min(i + chunkSize, total), total);
        }
        
        await delay(0);
    }
    
    return results;
}

/**
 * 分块写入 Excel
 * 
 * @param {Object} worksheet ExcelJS worksheet 对象
 * @param {Array} rows 数据行
 * @param {number} startRow 起始行（默认1）
 * @param {number} chunkSize 每块大小
 * @param {Function} onProgress 进度回调
 */
export async function writeRowsChunk(worksheet, rows, startRow = 1, chunkSize = 500, onProgress = null) {
    const total = rows.length;
    
    for (let i = 0; i < total; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        
        chunk.forEach((row, index) => {
            const rowNum = startRow + i + index;
            worksheet.getRow(rowNum).values = row;
        });
        
        if (onProgress) {
            onProgress(Math.min(i + chunkSize, total), total);
        }
        
        await delay(0);
    }
}