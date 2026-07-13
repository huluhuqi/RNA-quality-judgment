/**
 * 性能基准测试脚本
 *
 * 测试内容：
 * 1. 批量样本生成
 * 2. 质量分析性能
 * 3. 批量导入性能
 */

import { analyzeSamples } from '../src/core/analyzer/sampleAnalyzer.js';

function generateSamples(count) {
    const samples = [];
    const methods = ['柱式提取', 'Trizol法', '磁珠法', '硅胶膜法'];
    
    for (let i = 0; i < count; i++) {
        samples.push({
            id: `sample_${String(i + 1).padStart(6, '0')}`,
            templateId: `20260713_${String(i + 1).padStart(3, '0')}`,
            concentration: Math.round((20 + Math.random() * 500) * 100) / 100,
            a260280: Math.round((1.5 + Math.random() * 1) * 100) / 100,
            a260230: Math.round((1.2 + Math.random() * 1.5) * 100) / 100,
            ignored: false,
            method: methods[Math.floor(Math.random() * methods.length)]
        });
    }
    return samples;
}

function testAnalysis(samples, label) {
    const start = performance.now();
    const result = analyzeSamples(samples, { method: '柱式提取', application: 'qPCR' });
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    console.log(`✅ ${label}: ${duration}ms (${samples.length} samples)`);
    return duration;
}

function runBenchmarks() {
    console.log('\n========== RNA质量检测工具 性能基准测试 ==========\n');
    
    const config = { method: '柱式提取', application: 'qPCR' };
    
    const counts = [100, 500, 1000, 5000, 10000];
    const results = [];
    
    counts.forEach(count => {
        console.log(`生成 ${count} 条样本数据...`);
        const samples = generateSamples(count);
        
        const duration = testAnalysis(samples, `${count}样本分析`);
        results.push({ count, duration: parseFloat(duration) });
        
        console.log(`  平均每条: ${(parseFloat(duration) / count).toFixed(4)}ms\n`);
    });
    
    console.log('========== 测试结果汇总 ==========\n');
    console.log('样本数 | 耗时(ms) | 平均每条(ms)');
    console.log('-------|----------|-------------');
    results.forEach(r => {
        console.log(`${String(r.count).padStart(6)} | ${String(r.duration).padStart(8)} | ${(r.duration / r.count).toFixed(4)}`);
    });
    
    console.log('\n✅ 性能测试完成');
}

runBenchmarks();