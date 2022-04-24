
function twitterRegex(link: string){
    var id = null
    if(link){
        if (link.match(/twitter\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default twitterRegex
