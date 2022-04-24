
function snapchatRegex(link: string){
    var id = null
    if(link){
        if (link.match(/snapchat\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default snapchatRegex
