/**
 * 应用全局配置
 *
 * 统一管理应用级配置项，便于维护和版本控制
 */
export default {
    // 应用名称
    name: 'RNA质量检测工具',
    
    // 版本号
    version: '1.0.0',
    
    // 构建版本
    build: 'RC1',
    
    // 发布日期
    releaseDate: '2026-07-13',
    
    // 默认主题
    defaultTheme: 'light',
    
    // 可用主题列表
    themes: ['light', 'dark'],
    
    // 最大样本数限制
    maxSampleCount: 50000,
    
    // 虚拟滚动阈值（超过此数量启用虚拟滚动）
    virtualScrollThreshold: 500,
    
    // 分析缓存过期时间（毫秒）
    cacheExpireTime: 3600000,
    
    // 是否启用性能监控
    enablePerformanceMonitor: false,
    
    // 是否启用 Worker（大数据量分析）
    enableWorker: true,
    
    // Worker 批处理大小
    workerBatchSize: 200
};