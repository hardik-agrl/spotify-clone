currentTrack = new Audio();
async function getSong() {
    let a = await fetch("http://127.0.0.1:8080/music/")
    let response = await a.text();

    
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let newSong = element.href.replaceAll("127.0.0.1:5500", "127.0.0.1:8080/music")
            songs.push(newSong)




        }
    }


    return songs;

}


function playMusic(track) {

    currentTrack.src = "http://127.0.0.1:8080/music/01%20" + track

    currentTrack.play();
}

async function main() {
    let songs = await getSong()



    let songUL = document.querySelector(".songList").getElementsByTagName("ol")[0];


    for (const song of songs) {
        let newsong = `<li>${song.split("01%20")[1].replaceAll("%20", " ")} </li>`;




        songUL.innerHTML = songUL.innerHTML + newsong;

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.innerHTML);
            playMusic(e.innerHTML);
        })

    });






}



main()