console.log("Lets write some javascript ")

async function main(){
    let a = await fetch("http://127.0.0.1:8080/music/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML= response;
    let as = div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
    }
    console.log(songs)
}

main()