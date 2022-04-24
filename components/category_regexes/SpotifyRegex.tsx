
function spotifyRegex(link: string){
    var id = null
    if(link){
        if (link.match(/spotify\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default spotifyRegex
