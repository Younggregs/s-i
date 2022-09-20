function pinterestRegex(link: string){
    var id = null
    if(link){
        if (link.match(/pinterest\.com/)) {
        }else if(link.match(/pin\.it/)){
        }else{
            return false
        }
    }
    return true
}
export default pinterestRegex
