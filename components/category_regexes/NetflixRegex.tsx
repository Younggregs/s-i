
function netflixRegex(link: string){
    if(link){
        if (link.match(/netflix\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default netflixRegex
