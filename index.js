currentTrack = new Audio();
let songs;
let index;
let currentvol
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

async function getSong() {
  let a = await fetch("http://127.0.0.1:8080/music/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(response)
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
      const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let newSong = element.href.replaceAll(
        "127.0.0.1:5500",
        "127.0.0.1:8080/music"
      );
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
  songs = await getSong();
  // console.log(songs)

  
    //Dynamic creation of listitems

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
    // if(index>0){

        let nextsong = document.querySelector(".songList").getElementsByTagName("li")[index+1]
        playMusic(nextsong.querySelector(".songcard").firstElementChild.innerHTML)
    // }
    
        // playMusic(songs[index-1]);
      
  })

  

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



  // document.querySelector(".volscroll").addEventListener("click",element=>{
  //   console.log(element.offsetX, element.target.getBoundingClientRect().width)
  //   let voldivide = (element.offsetX/ element.target.getBoundingClientRect().width);
  //   document.querySelector(".volround").style.left = voldivide *100 +'%';
  // })

  vol.addEventListener("click",element=>{
    console.log(currentTrack.volume)
    // if()
    if(currentTrack.volume>0){
        currentTrack.volume =0;
        vol.getElementsByTagName("img")[0].src = "mute.svg";
        // console.log(currentvol);
    }
    else{
      currentTrack.volume = currentvol;
      vol.getElementsByTagName("img")[0].src = "volume.svg";
    }
    
    
  })

  // document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",element=>{
  // })
  
  volscroll.addEventListener("change",(e)=>{
    currentvol = parseInt(e.target.value)/100;
    currentTrack.volume = currentvol;
    // console.log(currentvol);
  })
}

main();
