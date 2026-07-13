export const EXTRACTION_METHODS = {

    column: {

        name: "柱式提取",

        advice: {

            protein:
                "检查裂解后蛋白去除是否充分，避免吸取沉淀，必要时增加洗涤步骤。",

            salt:
                "检查洗涤液配制及乙醇添加是否正确，增加一次柱膜洗涤。",

            phenol:
                "检查裂解液成分，必要时增加氯仿抽提步骤。"

        }

    },

    trizol: {

        name: "TRIzol法",

        advice: {

            protein:
                "重点检查氯仿分相过程，避免吸取中间蛋白层，提高分相离心质量。",

            phenol:
                "检查水相回收位置，避免酚层污染，可增加乙醇洗涤步骤。",

            salt:
                "检查异丙醇沉淀和乙醇洗涤过程，充分去除残留试剂。"

        }

    },

    magnetic: {

        name: "磁珠法",

        advice: {

            protein:
                "检查磁珠结合及洗涤步骤，提高洗涤效率。",

            salt:
                "增加磁珠洗涤次数，延长磁珠干燥时间，减少残留乙醇。",

            phenol:
                "检查磁珠与样本混合充分性，必要时增加洗涤次数。"

        }

    },

    other: {

        name: "其它方法",

        advice: {

            protein:
                "检查裂解、纯化和洗涤步骤是否充分。",

            salt:
                "检查洗涤和干燥步骤是否充分。",

            phenol:
                "检查分相和纯化步骤。"

        }

    }

}
