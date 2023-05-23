import got from "got";
import fs from "node:fs";
import { replaceSpace, downLoadImg } from "./utils.js";

// const url =
//   "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p692813374.jpg";

// const writeStream = fs.createWriteStream("src/aaa.jpg");

// got
//   .stream(url)
//   .once("error", (err) => {
//     console.log(err.name);
//     const filePath = writeStream.path;
//     console.log(filePath);

//     fs.rmSync(filePath);
//   })
//   .pipe(writeStream);

// console.log(replaceSpace("小森林 夏秋篇"));

// const downloadList = [
//   {
//     url: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2564498893.jpg",
//     title: "小森林夏秋篇",
//     extname: ".jpg",
//   },
//   {
//     url: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2215147728.jpg",
//     title: "小森林冬春篇",
//     extname: ".jpg",
//   },
//   {
//     url: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1910899751.jpg",
//     title: "饮食男女",
//     extname: ".jpg",
//   },
//   {
//     url: "https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2220776342.jpg",
//     title: "爆裂鼓手",
//     extname: ".jpg",
//   },
// ];
// await downLoadImg("data", downloadList, 5000);
