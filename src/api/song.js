import request from "@/request/index";

// 根据关键词搜索歌曲
export async function searchSong(params) {
  try {
    let result = await request("/cloudsearch", params);
    // debugger;
    let songs = result.result.songs.slice();
    songs = songs.map((item) => ({
      url: item.url,
      name: item.name,
      singer: item.ar[0].name,
      pic: item.al.picUrl,
      id: item.id,
      duration: Math.ceil(item.dt / 1000),
      album: item.al.name,
      isWY: true,
    }));
    return songs;
  } catch (err) {}
}

/**
 *
 * @param songs {Array}
 * arrId 是 多个的id 以,号相连
 */
// 获取到歌曲的url并进行处理
export async function myProcessSongs(songs) {
  let arrId = songs.map((item) => item.id).join(",");
  try {
    const result = await request("/song/url", {
      id: arrId,
    });
    //  debugger;
    let song2 = result.data;
    songs.forEach((item) => {
      const findItem = song2.find((item2) => item2.id === item.id);
      item.url = findItem.url;
    });
    // console.log(songs, "ssss9999");
    return songs;
  } catch (err) {}
}
