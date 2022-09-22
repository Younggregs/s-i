
function instagramRegex(link: string){
    if(link){
        if (link.match(/instagram\.com/)) {
        }else{
            return false
        }
    }
    
    return true
}
export default instagramRegex
