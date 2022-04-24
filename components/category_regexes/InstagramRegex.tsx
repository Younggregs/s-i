
function instagramRegex(link: string){
    var id = null
    if(link){
        if (link.match(/instagram\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default instagramRegex
