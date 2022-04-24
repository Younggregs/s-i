
function netflixRegex(link: string){
    var id = null
    if(link){
        if (link.match(/netflix\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default netflixRegex
