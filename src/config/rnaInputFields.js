/**
 * RNA样本输入字段定义
 */

export const RNA_INPUT_FIELDS = [

    {
        value: "templateId",
        label: "模板ID"
    },

    {
        value: "concentration",
        label: "RNA浓度"
    },

    {
        value: "a260280",
        label: "A260/280"
    },

    {
        value: "a260230",
        label: "A260/230"
    }

];

/**
 * 获取可选择字段
 *
 * 排除已经被其它输入框选择的字段
 *
 * @param {string} current   当前窗格已选字段
 * @param {string[]} selected 所有窗格已选字段列表
 */
export function getAvailableFields(current, selected = []) {

    return RNA_INPUT_FIELDS.filter(item =>

        item.value === current
        ||
        !selected.includes(item.value)

    );

}
