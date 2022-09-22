
function snapchatRegex(link: string){
    if(link){
        if (link.match(/snapchat\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default snapchatRegex
