currentTrack = new Audio();
let songs;
let index;
let currentvol;
function formatTime(seconds) {
  // Ensure the input is a number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and seconds
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  // Format as 2-digit values
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function getSong() {
  // let a = await fetch("http://127.0.0.1:5500/music%20folder/music/");
  let a = await fetch(
    "https://hardik-spotify.netlify.app/music%20folder/Non%20Copyright%201/"
  );
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      let newSong = element.href;
      // .replaceAll(
      //   "127.0.0.1:5500",
      //   "127.0.0.1:8080/music"
      // );
      songs.push(newSong);
    }
  }

  return songs;
}

function playMusic(track) {
  currentTrack.src =
    "https://hardik-spotify.netlify.app/music%20folder/Non%20Copyright%201/-" + track;

  currentTrack.play();

  console.log(currentTrack);

  play.src = "images/pause.svg";
  document.querySelector(".titleName").innerHTML = track.slice(0, 35) + "..";
  document.querySelector(".duration").innerHTML = "00:00/00:00";
  let songname =
    "https://hardik-spotify.netlify.app/music%20folder/Non%20Copyright%201/-" +
    encodeURI(track);
  index = songs.indexOf(songname);
}

// Main Function

async function main() {
  songs = await getSong();

  //Dynamic creation of listitems

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ol")[0];

  for (const song of songs) {
    // console.log(decodeURI(song).split("-")[1]);
    let newsong = `<li>
        <img src="images/music.svg" alt="">
        <div class="songcard">

            <div>${decodeURI(song).split("-").slice(1).join("-")}</div>
            <div>Hardik</div>
        </div>


        <img src="images/play.svg" alt="">

    </li>`;

    songUL.innerHTML = songUL.innerHTML + newsong;
  }

  //Event Listener for PlayCard

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".songcard").firstElementChild.innerHTML);
      playMusic(e.querySelector(".songcard").firstElementChild.innerHTML);
    });
  });

  //Event listener for play button

  play.addEventListener("click", (e) => {
    if (currentTrack.paused) {
      currentTrack.play();
      play.src = "images/pause.svg";
    } else {
      currentTrack.pause();
      play.src = "images/playB.svg";
    }
  });

  //Event listener for prev

  prev.addEventListener("click", (element) => {
    if (index > 0) {
      let prevsong = document
        .querySelector(".songList")
        .getElementsByTagName("li")[index - 1];
      playMusic(
        prevsong.querySelector(".songcard").firstElementChild.innerHTML
      );
    }
  });

  //Event listener for next

  next.addEventListener("click", (element) => {
    if (index < songs.length - 1) {
      let nextsong = document
        .querySelector(".songList")
        .getElementsByTagName("li")[index + 1];
      playMusic(
        nextsong.querySelector(".songcard").firstElementChild.innerHTML
      );
    }
  });

  //Event Listener for Current Track

  currentTrack.addEventListener("timeupdate", () => {
    let time = currentTrack.currentTime / currentTrack.duration;
    document.querySelector(".duration").innerHTML = `${formatTime(
      currentTrack.currentTime
    )}/${formatTime(currentTrack.duration)}`;

    document.querySelector(".seekButton").style.left = time * 100 + "%";
  });

  //Event Listener for Seekbar

  document.querySelector(".seekBar").addEventListener("click", (e) => {
    document.querySelector(".seekButton").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    currentTrack.currentTime =
      (e.offsetX / e.target.getBoundingClientRect().width) *
      currentTrack.duration;
  });

  vol.addEventListener("click", (element) => {
    console.log(currentTrack.volume);

    if (currentTrack.volume > 0) {
      currentTrack.volume = 0;
      vol.getElementsByTagName("img")[0].src = "images/mute.svg";
    } else {
      currentTrack.volume = currentvol;
      vol.getElementsByTagName("img")[0].src = "images/volume.svg";
    }
  });

  volscroll.addEventListener("change", (e) => {
    currentvol = parseInt(e.target.value) / 100;
    currentTrack.volume = currentvol;
  });
}

main();
