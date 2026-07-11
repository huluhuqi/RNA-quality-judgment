import jsPDF from 'jspdf'

import 'jspdf-autotable'



export function exportPDF(
summary,
data
){


const doc =
new jsPDF()



doc.setFontSize(16)


doc.text(

"RNA Quality Judgment Report",

10,

15

)




doc.setFontSize(11)


doc.text(

`样本数量:${summary.count}`,

10,

30

)



doc.text(

`RNA质量:${summary.quality}`,

10,

40

)



doc.text(

`污染分析:${summary.pollution}`,

10,

50

)



doc.text(

`RT推荐:${summary.rt.recommendedRNA} ng`,

10,

60

)






const tableData = data.map(

item=>[

item.id,

item.concentration,

item.a260280,

item.a260230

]

)





doc.autoTable({

startY:70,

head:[

[
"模板ID",
"浓度",
"A260/A280",
"A260/A230"

]

],


body:tableData


})




doc.save(

"RNA_quality_report.pdf"

)


}
