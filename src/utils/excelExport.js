import * as XLSX from 'xlsx'



export function exportExcel(data){


    const worksheet =
        XLSX.utils.json_to_sheet(data)



    const workbook =
        XLSX.utils.book_new()



    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "RNA分析结果"

    )



    XLSX.writeFile(

        workbook,

        "RNA_quality_report.xlsx"

    )


}
