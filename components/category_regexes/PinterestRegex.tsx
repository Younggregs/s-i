function pinterestRegex(link: string){
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
