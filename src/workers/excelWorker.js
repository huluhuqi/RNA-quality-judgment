/**
 * Excel 解析 Worker
 *
 * 在后台线程解析 Excel 文件，避免阻塞主线程
 * 支持大批量数据导入（5000-10000+样本）
 */

// 内联 xlsx 核心解析逻辑
// 注意：Worker 中不能直接使用 import，需要通过 importScripts 或打包工具处理

/**
 * 处理 Excel 文件解析
 * 
 * @param {File} file Excel 文件
 * @returns {Promise<Array>} 解析后的数据
 */
async function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                // 动态加载 xlsx 库（需要在 vite.config.js 中配置）
                importScripts('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
                
                const workbook = XLSX.read(event.target.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                
                // 转换为对象数组
                if (data.length < 2) {
                    resolve([]);
                    return;
                }
                
                const headers = data[0];
                const result = data.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });
                
                resolve(result);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsArrayBuffer(file);
    });
}

// Worker 消息处理
self.onmessage = async function(e) {
    const { type, data } = e.data;
    
    try {
        switch (type) {
            case 'parse-excel': {
                const result = await parseExcelFile(data);
                self.postMessage({
                    success: true,
                    data: result,
                    count: result.length
                });
                break;
            }
            
            default:
                self.postMessage({
                    success: false,
                    error: '未知操作类型: ' + type
                });
        }
    } catch (error) {
        self.postMessage({
            success: false,
            error: error.message
        });
    }
};

// 错误处理
self.onerror = function(error) {
    self.postMessage({
        success: false,
        error: error.message || 'Worker 内部错误'
    });
};