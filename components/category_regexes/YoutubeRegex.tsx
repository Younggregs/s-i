
function youtubeRegex(link: string){
    var id = null
    if(link){
        if (link.match(/youtube\.com\/watch\?v=([^&?/]+)/)) {
            id = link.match(/youtube\.com\/watch\?v=([^&?/]+)/)
        }else if(link.match(/youtube\.com\/embed\/([^&?/]+)/)){
            id = link.match(/youtube\.com\/embed\/([^&?/]+)/)
        }else if(link.match(/youtube\.com\/v\/([^&?/]+)/)){
            id = link.match(/youtube\.com\/v\/([^&?/]+)/)
        }else if(link.match(/youtu\.be\/([^&?/]+)/)){
            id = link.match(/youtu\.be\/([^&?/]+)/)
        }else if(link.match(/youtube\.com\/shorts\/([^&?/]+)/)){
            id = link.match(/youtube\.com\/shorts\/([^&?/]+)/)
        }else if(link.match(/youtube\.com\/verify_age\?next_url=\/watch%3Fv%3D([^&?/]+)/)){
            id = link.match(/youtube\.com\/verify_age\?next_url=\/watch%3Fv%3D([^&?/]+)/)
        }else{
            return false
        }
    }
    
    if(id){
        id = id[1]
    }

    return id
}
export default youtubeRegex
