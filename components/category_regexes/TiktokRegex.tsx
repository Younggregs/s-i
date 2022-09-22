
function tiktokRegex(link: string){
    if(link){
        if (link.match(/tiktok\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default tiktokRegex
