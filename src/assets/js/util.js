export function shuffle(source) {
  const arr = source.slice();
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i);
    swap(arr, i, j);
  }
  return arr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function swap(arr, i, j) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

export function formatTime(interval) {
  interval = interval | 0;
  const minute = (((interval / 60) | 0) + "").padStart(2, "0");
  const second = ((interval % 60) + "").padStart(2, "0");
  return `${minute}:${second}`;
}
// 格式化音乐时长
export function formatDuration(time) {
  if (time > -1) {
    // let hour = Math.floor(time / 3600);
    let min = Math.floor(time / 60) % 60;
    let sec = time % 60;
    time = "";
    // if (hour < 10) {
    //   time = "0" + hour + ":";
    // } else {
    //   time = hour + ":";
    // }
    if (min < 10) {
      time += "0";
    }
    time += min + ":";

    if (sec < 10) {
      time += "0";
    }
    time += sec;
  }
  //console.log(time, "time");
  //let i = time.indexOf(":");
  return time;
  //return time.substring(i + 1);
}
