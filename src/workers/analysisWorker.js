/**
 * RNA 样本分析 Worker
 *
 * 在后台线程执行批量 RNA 分析，避免阻塞主线程
 * 支持进度回调和分块处理
 */

// 分析函数（从核心模块复制，因为 Worker 无法直接导入）
// 注意：这是简化版本，完整版本需要通过 vite 打包

/**
 * 计算单个样本的质量评分
 */
function calculateQualityScore(sample) {
    const a280 = Number(sample.a260280);
    const a230 = Number(sample.a260230);
    const concentration = Number(sample.concentration);
    
    let score = 50; // 基础分
    
    // A260/280 评分
    if (!isNaN(a280)) {
        if (a280 >= 1.8 && a280 <= 2.0) {
            score += 25;
        } else if (a280 >= 1.7 && a280 <= 2.1) {
            score += 15;
        } else if (a280 >= 1.6 && a280 <= 2.2) {
            score += 5;
        } else {
            score -= 10;
        }
    }
    
    // A260/230 评分
    if (!isNaN(a230)) {
        if (a230 >= 2.0) {
            score += 15;
        } else if (a230 >= 1.8) {
            score += 10;
        } else if (a230 >= 1.5) {
            score += 5;
        } else {
            score -= 5;
        }
    }
    
    // 浓度评分
    if (!isNaN(concentration) && concentration > 0) {
        if (concentration >= 100) {
            score += 10;
        } else if (concentration >= 50) {
            score += 5;
        }
    }
    
    return Math.max(0, Math.min(100, score));
}

/**
 * 判断质量等级
 */
function getQualityLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'poor';
    return 'fail';
}

/**
 * 分析单个样本
 */
function analyzeSample(sample) {
    const score = calculateQualityScore(sample);
    const quality = getQualityLevel(score);
    
    const pollution = [];
    const a280 = Number(sample.a260280);
    const a230 = Number(sample.a260230);
    
    if (!isNaN(a280) && a280 < 1.8) {
        pollution.push({
            type: '蛋白质/酚类污染风险',
            level: 'high',
            reason: `A260/280=${a280.toFixed(2)}，低于正常范围`
        });
    }
    
    if (!isNaN(a230) && a230 < 1.5) {
        pollution.push({
            type: '盐类/试剂残留风险',
            level: 'high',
            reason: `A260/230=${a230.toFixed(2)}，明显偏低`
        });
    }
    
    if (isNaN(a230)) {
        pollution.push({
            type: '未检测A260/230',
            level: 'info',
            reason: '仅根据A260/280进行污染判断'
        });
    }
    
    return {
        quality,
        qualityScore: score,
        pollution,
        status: {
            rtRecommend: !isNaN(sample.concentration) && sample.concentration > 0,
            qualityAnalysis: !isNaN(a280),
            fullPollutionAnalysis: !isNaN(a230),
            only280Analysis: isNaN(a230) && !isNaN(a280)
        }
    };
}

/**
 * 批量分析样本
 */
function batchAnalyze(samples, chunkSize = 200) {
    const results = [];
    const total = samples.length;
    
    for (let i = 0; i < total; i++) {
        const sample = samples[i];
        const analysis = analyzeSample(sample);
        
        results.push({
            ...sample,
            result: analysis
        });
        
        // 每处理 chunkSize 个样本，发送进度更新
        if ((i + 1) % chunkSize === 0 || i === total - 1) {
            const progress = Math.round(((i + 1) / total) * 100);
            self.postMessage({
                type: 'progress',
                progress,
                processed: i + 1,
                total
            });
        }
    }
    
    return results;
}

// Worker 消息处理
self.onmessage = function(e) {
    const { type, data, options } = e.data;
    
    try {
        switch (type) {
            case 'analyze': {
                const chunkSize = options?.chunkSize || 200;
                const results = batchAnalyze(data, chunkSize);
                
                self.postMessage({
                    type: 'complete',
                    success: true,
                    data: results,
                    count: results.length
                });
                break;
            }
            
            default:
                self.postMessage({
                    type: 'error',
                    success: false,
                    error: '未知操作类型: ' + type
                });
        }
    } catch (error) {
        self.postMessage({
            type: 'error',
            success: false,
            error: error.message
        });
    }
};

// 错误处理
self.onerror = function(error) {
    self.postMessage({
        type: 'error',
        success: false,
        error: error.message || 'Worker 内部错误'
    });
};