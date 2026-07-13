/**
 * RNA 质量判断规则配置
 *
 * 将质量判断的阈值参数配置化，便于调整和维护
 * 修改规则无需改动业务代码
 */
export default {
    // A260/280 判定标准
    A260280: {
        excellent: 2.0,    // 优秀阈值
        good: 1.8,         // 良好阈值
        warning: 1.7,      // 一般阈值
        poor: 1.5,         // 较差阈值
        fail: 1.0          // 不合格阈值
    },
    
    // A260/230 判定标准
    A260230: {
        excellent: 2.0,    // 优秀阈值
        good: 1.8,         // 良好阈值
        warning: 1.5,      // 警告阈值（盐类污染风险）
        fail: 1.0          // 不合格阈值
    },
    
    // 浓度判定标准（ng/μL）
    concentration: {
        excellent: 100,    // 优秀阈值
        good: 50,          // 良好阈值
        warning: 20,       // 一般阈值
        poor: 5,           // 较差阈值
        fail: 0            // 不合格阈值（无数据）
    },
    
    // 质量评分权重
    scoreWeight: {
        a260280: 40,       // A260/280 权重
        a260230: 30,       // A260/230 权重
        concentration: 30   // 浓度权重
    },
    
    // 质量等级配置
    levels: {
        excellent: {
            label: '优秀',
            minScore: 90,
            color: '#67c23a'
        },
        good: {
            label: '良好',
            minScore: 75,
            color: '#409eff'
        },
        warning: {
            label: '一般',
            minScore: 60,
            color: '#e6a23c'
        },
        poor: {
            label: '较差',
            minScore: 40,
            color: '#f56c6c'
        },
        fail: {
            label: '不合格',
            minScore: 0,
            color: '#909399'
        }
    },
    
    // 污染判定规则
    pollution: {
        protein: {
            threshold: 1.7,
            type: '蛋白质/酚类污染风险',
            level: 'high'
        },
        salt: {
            threshold: 1.5,
            type: '盐类/试剂残留风险',
            level: 'high'
        },
        unknown230: {
            type: 'A260/230未检测',
            level: 'info'
        }
    }
};