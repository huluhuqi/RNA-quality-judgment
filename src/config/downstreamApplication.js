export const downstreamApplications = {

qPCR:{

name:"qPCR检测",

qualityLevel:"常规",

requirements:{

a280:[1.8,2.2],

a230:1.5

},

advice:`qPCR实验对RNA纯度要求中等。重点关注：1. A260/A280是否处于合理范围；2. 是否存在明显PCR抑制物；3. RNA投入量保持一致。若A260/A230偏低，建议RNA纯化后再进行反转录。`

},

RNAseq:{

name:"RNA-seq转录组测序",

qualityLevel:"严格",

requirements:{

a280:[1.9,2.1],

a230:2.0

},

advice:`RNA-seq对RNA质量要求较高。除纯度外，建议结合：1. RNA完整性(RIN值)；2. 降解情况；3. 盐类和有机物残留。A260/A230低于2.0时，建议进行RNA cleanup。`

},

smallRNA:{

name:"小RNA检测/测序",

qualityLevel:"严格",

requirements:{

a280:[1.8,2.1],

a230:1.8

},

advice:`小RNA实验对低分子RNA保存较敏感。建议：1. 避免反复冻融；2. 控制RNase污染；3. 确认提取方法适合小RNA回收。`

},

northern:{

name:"Northern blot",

qualityLevel:"严格",

requirements:{

a280:[1.9,2.1],

a230:1.8

},

advice:`Northern blot需要较高完整性RNA。建议：1. 检查RNA降解情况；2. 避免冻融；3. 必要时检测RNA完整性。`

},

microarray:{

name:"芯片检测",

qualityLevel:"严格",

requirements:{

a280:[1.9,2.1],

a230:2.0

},

advice:`芯片检测对批次一致性要求较高。建议：1. 保持所有样本提取流程一致；2. 控制纯度差异；3. 异常样本重新纯化。`

},

RT保存:{

name:"反转录模板保存",

qualityLevel:"常规",

requirements:{

a280:[1.8,2.2],

a230:1.5

},

advice:`用于反转录保存时，重点关注：1. RNA浓度；2. 模板体积；3. 抑制物残留。`

}

}
