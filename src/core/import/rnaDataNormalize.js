/**
 * RNA导入数据标准化
 *
 * 功能：
 * 1. 自动生成模板ID（格式：YYYYMMDD_001）
 * 2. 清除空行
 * 3. 补齐缺失字段为 null
 * 4. 重复ID检测
 */
import { generateTemplateId, getDateString } from "../sample/idGenerator";
import { getNumber } from "../sample/sampleUtils";


/**
 * 标准化导入数据
 *
 * @param {Array} samples 原始样本数组
 * @returns {Array} 标准化后的样本数组
 */
export function normalizeRNAData(samples = []) {

    const today = getDateString();

    let index = 1;

    const result = samples

        .map(item => {

            return {

                templateId:
                    normalizeId(
                        item.templateId,
                        () => generateTemplateId(index++)
                    ),

                concentration:
                    getNumber(item.concentration),

                a260280:
                    getNumber(item.a260280),

                a260230:
                    getNumber(item.a260230)

            };

        })

        // 删除完全空数据（所有字段都为空）
        .filter(item => {

            return (

                item.templateId
                ||
                item.concentration !== null
                ||
                item.a260280 !== null
                ||
                item.a260230 !== null

            );

        });

    return result;

}


/**
 * 检测并标记重复ID
 *
 * @param {Array} samples 标准化后的样本数组
 * @returns {Array} 重复的样本列表
 */
export function checkDuplicateIds(samples = []) {

    const map = {};

    return samples.filter(item => {

        if (map[item.templateId]) {
            return true;
        }

        map[item.templateId] = true;

        return false;

    });

}


/**
 * 模板ID处理
 *
 * 有值 → 保留原值
 * 空值 → 自动生成 YYYYMMDD_001 格式
 */
function normalizeId(id, generateId) {

    if (
        id !== undefined
        &&
        id !== null
        &&
        String(id).trim() !== ""
    ) {
        return String(id).trim();
    }

    return generateId();

}



