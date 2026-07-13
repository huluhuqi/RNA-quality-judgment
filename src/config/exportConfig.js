/**
 * 导出配置
 *
 * 统一管理 Excel/PDF 导出相关配置
 */
export default {
    // Excel 导出配置
    excel: {
        // 文件名前缀
        fileNamePrefix: 'RNA质量检测报告',
        
        // Sheet1 列定义
        sampleSheetColumns: [
            { key: 'templateId', header: '模板ID', width: 18 },
            { key: 'concentration', header: 'RNA浓度', width: 15 },
            { key: 'a260280', header: 'A260/280', width: 12 },
            { key: 'a260230', header: 'A260/230', width: 12 },
            { key: 'quality', header: 'RNA质量', width: 12 },
            { key: 'qualityScore', header: '质量评分', width: 10 },
            { key: 'pollution', header: '污染分析', width: 40 },
            { key: 'extractionProblem', header: '提取问题', width: 30 },
            { key: 'suggestion', header: '优化建议', width: 50 }
        ],
        
        // 是否冻结首行
        freezeHeader: true,
        
        // 是否自动换行
        autoWrapText: true,
        
        // 大数据量分块大小
        chunkSize: 500
    },
    
    // PDF 导出配置
    pdf: {
        // 文件名前缀
        fileNamePrefix: 'RNA质量检测实验报告',
        
        // 页面格式
        pageFormat: 'a4',
        
        // 页面方向
        orientation: 'portrait',
        
        // 页面边距（mm）
        margin: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
        },
        
        // 图表导出分辨率（像素比）
        chartPixelRatio: 3,
        
        // 图表背景色（固定白底便于打印）
        chartBackgroundColor: '#ffffff',
        
        // 是否包含封面
        includeCover: true,
        
        // 是否包含图表
        includeCharts: true,
        
        // 是否包含异常样本列表
        includeAbnormalSamples: true,
        
        // 是否包含完整样本数据
        includeAllSamples: true,
        
        // 大批量数据时是否只导出摘要（阈值）
        summaryOnlyThreshold: 1000
    },
    
    // 通用配置
    common: {
        // 是否过滤忽略样本
        filterIgnoredSamples: true,
        
        // 是否包含分析结论
        includeConclusion: true,
        
        // 是否包含建议
        includeSuggestions: true
    }
};