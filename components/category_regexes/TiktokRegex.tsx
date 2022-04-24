
function tiktokRegex(link: string){
    var id = null
    if(link){
        if (link.match(/tiktok\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default tiktokRegex
