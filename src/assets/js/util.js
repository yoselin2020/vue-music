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
// 创建雪花函数
export function createSnow(parentElement) {
  if (!parentElement) {
    parentElement = document.body;
  }
  //起点坐标
  const start = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    scale: Math.random() * 1.2,
  };
  // 生成一个随机数
  const num = getRandom(0, 8);
  // 创建一个 div元素
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = 0;
  div.style.top = 0;
  // div.innerText = "*";
  div.style.color = "#fff";
  div.style.transition = "all 2s";
  div.style.zIndex = 999;
  div.style.pointerEvents = "none";
  div.className = "snow-wrapper";
  let img = document.createElement("img");
  let src = require(`@/assets/js/images/snow${num}.png`);
  img.src = src;
  img.style.width = 12 + "px";
  img.style.height = 12 + "px";
  div.style.transform = `translate3d(${start.x}px,${start.y}px,0) scale(${start.scale})`;
  //div.appendChild(img);
  const rgb = randomRgbColor();
  div.innerHTML = `<i class='iconfont2 icon-xuehua' style="color: ${rgb};font-size: 10px"></i>`;

  // div.style.fontSize = 10 + "px";

  // div.innerHTML = `<images :src='' alt=''>`;
  parentElement.appendChild(div);
  // 结束坐标
  const end = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    scale: Math.random() * 1.2,
  };
  // 让浏览器触发重绘
  div.offsetHeight;

  div.addEventListener("transitionend", function () {
    //console.log("动画结束了");
    this.remove();
  });
  div.style.transform = `translate3d(${end.x}px,${end.y}px,0) scale(${end.scale})`;
}
// 生成一个随机数
export function getRandom(min = 0, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// 生成rgb 颜色
export function randomRgbColor() {
  //随机生成RGB颜色
  let r = Math.floor(Math.random() * 256); //随机生成256以内r值
  let g = Math.floor(Math.random() * 256); //随机生成256以内g值
  let b = Math.floor(Math.random() * 256); //随机生成256以内b值
  return `rgb(${r},${g},${b})`; //返回rgb(r,g,b)格式颜色
}
