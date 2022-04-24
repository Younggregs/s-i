
function facebookRegex(link: string){
    var id = null
    if(link){
        if (link.match(/facebook\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default facebookRegex
