export function parsePasteData(text){


    const rows = text
        .split(/\r?\n/)
        .filter(row => row.trim() !== '')



    const result = []


    rows.forEach(row=>{


        const cols = row.split(/\t/)



        if(cols.length < 1){
            return
        }


        const id = cols[0]?.trim()



        if(!id){
            return
        }



        result.push({

            id:id,

            concentration:
                Number(cols[1]) || null,


            a260280:
                Number(cols[2]) || null,


            a260230:
                Number(cols[3]) || null,


        })



    })



    return result


}
