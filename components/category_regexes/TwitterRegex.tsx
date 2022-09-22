
function twitterRegex(link: string){
    if(link){
        if (link.match(/twitter\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default twitterRegex
