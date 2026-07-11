import {
extractionDiagnosis
}
from "./extractionDiagnosis"



export function getExtractionAdvice(
method,
type
){


const methodData =
extractionDiagnosis[method]



if(!methodData){

return null

}



return methodData[type]


}
