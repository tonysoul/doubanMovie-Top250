import { Crowller } from "./crowller";
import { DoubanAnalyze } from "./doubanAnalyze";
import { sleep, writeReadMe } from "./utils";

async function init() {
  // const url = "http://localhost:3000";
  let n = 0;
  let page = 1;
  let url = `https://movie.douban.com/top250?start=${n}&filter=`;
  const analyzer = new DoubanAnalyze();
  const instance = new Crowller(url, analyzer, {
    destDir: "data/doubanTop250",
    downLoadPic: true,
  });

  async function run() {
    console.log("============== start download ==============");

    for (let i = 0; i < page; i++) {
      n = i * 25;
      url = `https://movie.douban.com/top250?start=${n}&filter=`;

      instance.setUrl = url;
      console.log("\n");
      console.log(`----------- start download page ${i + 1} ----------------`);
      console.log(url);

      await instance.bootstrap();
      await sleep(5000);
      console.log(`----------- end download page ${i + 1} -----------`);
    }

    console.log("\n");
    console.log("============== end download ==============");
  }

  await run();

  // 写入README.md文件
  writeReadMe(instance.dataJsonFile, "data/doubanTop250/imgs/");
}

init();