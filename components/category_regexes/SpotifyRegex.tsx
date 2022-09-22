
function spotifyRegex(link: string){
    if(link){
        if (link.match(/spotify\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default spotifyRegex
