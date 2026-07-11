/**
 * RNA质量判断标准
 *
 * 后期修改阈值只改这里。
 * 当未指定下游应用配置时，使用本默认标准。
 */


export const QUALITY_STANDARD = {

    excellent:{
        a280Min:1.9,
        a280Max:2.1,
        a230Min:1.8
    },

    good:{
        a280Min:1.8,
        a280Max:2.2,
        a230Min:1.5
    },

    normal:{
        a280Min:1.6,
        a280Max:2.3
    }

};
