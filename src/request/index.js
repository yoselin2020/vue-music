import request from "./ajax";
export default function (url = "", data = {}, method = "get") {
  // debugger;
  return new Promise(async (resolve, reject) => {
    // debugger;
    try {
      const res = await request({
        url,
        method,
        [method.toUpperCase() === "get".toUpperCase() ? "params" : "data"]:
          data,
      });
      // console.log(res, "ressss");
      resolve(res.data);
      // console.log("请求成功了");
    } catch (err) {
      //   debugger;
      return reject(err.data);
    }
  });
}
