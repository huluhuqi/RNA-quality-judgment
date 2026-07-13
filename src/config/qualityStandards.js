/**
 * RNA质量评价标准
 *
 * 根据下游实验用途不同，设定不同的质量阈值：
 *   - normal:    常规RT实验，标准较宽松
 *   - qpcr:      RT-qPCR，标准适中
 *   - rnaseq:    RNA-seq，标准严格
 *   - smallRNA:  小核酸实验，标准严格
 */
export const QUALITY_STANDARDS = {

    normal: {

        name: "常规RT",

        a260280: {
            ideal: [1.8, 2.1],
            warning: [1.7, 2.2]
        },

        a260230: {
            ideal: 1.8,
            warning: 1.5
        }

    },

    qpcr: {

        name: "RT-qPCR",

        a260280: {
            ideal: [1.8, 2.1],
            warning: [1.7, 2.2]
        },

        a260230: {
            ideal: 1.8,
            warning: 1.5
        }

    },

    rnaseq: {

        name: "RNA-seq",

        a260280: {
            ideal: [1.9, 2.1],
            warning: [1.8, 2.2]
        },

        a260230: {
            ideal: 2.0,
            warning: 1.8
        }

    },

    smallRNA: {

        name: "小核酸实验",

        a260280: {
            ideal: [1.9, 2.1],
            warning: [1.8, 2.2]
        },

        a260230: {
            ideal: 1.8,
            warning: 1.6
        }

    }

};
