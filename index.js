currentTrack = new Audio();
let songs;
let folders;
let index;
let folderUrl

function formatTime(seconds) {
  // Ensure the input is a number
  if (isNaN(seconds) || seconds < 0) {
    // console.error("Invalid seconds value:", seconds);
    return "00:00";
  }

  // Calculate minutes and seconds
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  // Format as 2-digit values
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getFolder() {
    let url = await fetch("http://127.0.0.1:8080");
    let response =await url.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let asFolder = div.getElementsByTagName("a")
    let folders = []
    for (let index = 0; index < asFolder.length; index++) {
        const element = asFolder[index];
        if(element.href.endsWith("/")){
            let newfolder = element.href.replaceAll(
                "127.0.0.1:5500",
                "127.0.0.1:8080"
              );
            folders.push(newfolder);
        }
        
    }
    // console.log(folders);
    // console.log(asFolder.href);
    return folders;


    
}
// getFolder()

async function getSong() {
 folders = await getFolder()
 
  let a = await fetch(`${folderUrl}`);
//   console.log(folders);
//   let a = await fetch("http://127.0.0.1:8080/music2/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
    if (element.href.endsWith(".mp3")) {
        let newSong = element.href.replaceAll(
            "127.0.0.1:5500",
            "127.0.0.1:8080"
        );
        console.log(newSong);
      songs.push(newSong);
    }
  }
  
  return songs;
}



function playMusic(track) {
  currentTrack.src = "http://127.0.0.1:8080/music/01%20" + track;

  currentTrack.play();
//   console.log(currentTrack.volume)
  play.src = "pause.svg";
  document.querySelector(".titleName").innerHTML = track.slice(0,35)+"..";
  document.querySelector(".duration").innerHTML = "00:00/00:00";
  let songname = "http://127.0.0.1:8080/music/01%20" + encodeURI(track);
  index = songs.indexOf(songname);
//   console.log(songs);
//   console.log(songname);
//   console.log(index);
}








// Main Function

async function main() {
    
    folders = await getFolder()
    folderUrl = folders[0];
    songs = await getSong();
  // console.log(songs)

  
    //Dynamic creation of listitems
    // let child = document.createElement("div")
    let folderUl = document.querySelector(".play")
    // console.log(folderUl.innerHTML);
    // folderUl.appendChild(child)

    for (const folder of folders) {
        // let oldfolderName = folder.split("8080/")[1];
        // let newFolderName = oldfolderName.splice(0,oldfolderName.length);
        let newone =  `<div class="singlePlaylist ">
        <img class="playlistImg" src="https://i.scdn.co/image/ab67706f000000028bc5ca6d7da764ecbf763020"
            alt="">
        <img class="playButton" src="play.svg" alt="">
        <div class="playlistInfo ">
            <div class="songName"> ${folder.split("8080/")[1].split("/")[0]} </div>
            <div class="artist">Cover: ROSÉ</div>
        </div>
    </div> `

    folderUl.innerHTML = folderUl.innerHTML+ newone
        // console.log(child.innerHTML);
    }




  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ol")[0];

  for (const song of songs) {
    // let newsong = `<li>${song.split("01%20")[1].replaceAll("%20", " ")} </li>`;
    let newsong = `<li>
        <img src="music.svg" alt="">
        <div class="songcard">

            <div>${song.split("01%20")[1].replaceAll("%20", " ")}</div>
            <div>Hardik</div>
        </div>


        <img src="play.svg" alt="">

    </li>`;

    songUL.innerHTML = songUL.innerHTML + newsong;
  }


  //Event Listener for Folder Selection
  Array.from(document.querySelectorAll(".singlePlaylist")).forEach((e)=>{
    e.addEventListener("click",(element)=>{
        CurrentFolder = e.querySelector(".songName").innerHTML.trim()
        folderUrl = `http://127.0.0.1:8080/${CurrentFolder}/`
        console.log(e.querySelector(".songName").innerHTML)
        console.log(folderUrl)

        
    })
  })


  //Event Listener for PlayCard

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
    //   console.log(e);
    //   console.log(e.querySelector(".songcard").firstElementChild.innerHTML);
      playMusic(e.querySelector(".songcard").firstElementChild.innerHTML);
    });
  });

//   let currentTrack = document.querySelector(".songList").getElementsByTagName("li")[0].querySelector(".songcard").firstElementChild.innerHTML
//   playMusic(currentTrack)

  //Event listener for play button

  play.addEventListener("click", (e) => {
    // console.log("play is pressed")
    if (currentTrack.paused) {
      currentTrack.play();
      play.src = "pause.svg";
    } else {
      currentTrack.pause();
      play.src = "playB.svg";
    }
  });

  //Event listener for prev

  prev.addEventListener("click",element=>{
    if(index>0){

        let prevsong = document.querySelector(".songList").getElementsByTagName("li")[index-1]
        playMusic(prevsong.querySelector(".songcard").firstElementChild.innerHTML)
    }
    
        // playMusic(songs[index-1]);
      
  })



  //Event listener for next

  next.addEventListener("click",element=>{
    if(index<songs.length-1){

        let nextsong = document.querySelector(".songList").getElementsByTagName("li")[index+1]
        playMusic(nextsong.querySelector(".songcard").firstElementChild.innerHTML)
    }
    
        // playMusic(songs[index-1]);
      
  })



  

//   Array.from(document.querySelectorAll(".singlePlaylist")).forEach().addEventListener("click",()=>{
//     // folderUrl = 
//     console.log(document.querySelector(".singlePlaylist").querySelector(".songName").innerHTML);
//   })
  

  //Event Listener for Current Track

  currentTrack.addEventListener("timeupdate", () => {
    // console.log(currentTrack.duration, currentTrack.currentTime)
    let time = currentTrack.currentTime / currentTrack.duration;
    document.querySelector(".duration").innerHTML = `${formatTime(
      currentTrack.currentTime
    )}/${formatTime(currentTrack.duration)}`;
    // console.log(document.querySelector(".duration").innerHTML);

    document.querySelector(".seekButton").style.left = time * 100 + "%";
  });



  //Event Listener for Seekbar

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    // console.log(e.offsetX/e.target.getBoundingClientRect().width)
    document.querySelector(".seekButton").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentTrack.currentTime =
      (e.offsetX / e.target.getBoundingClientRect().width) *
      currentTrack.duration;
  });



  document.querySelector(".volscroll").addEventListener("click",element=>{
    console.log(element.offsetX, element.target.getBoundingClientRect().width)
    let voldivide = (element.offsetX/ element.target.getBoundingClientRect().width);
    document.querySelector(".volround").style.left = voldivide *100 +'%';
  })

  vol.addEventListener("click",element=>{
    console.log(currentTrack.volume())
    // if()
    if(vol.src = "volume.svg"){

        vol.src = "mute.svg";
    }
    
  })

}

main();
