export const filterQuery = (filterJson:string):Record<string,any> => {
    const filter = JSON.parse(filterJson)
    let query: Record<string, any> = {}
    
    for (const { field ,value } of filter) {
         (!isNaN(Number(value))) 
           ? query[field] = Number(value)
             : query[field] = new RegExp(value,"i")
    }
    return query

}