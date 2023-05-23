import fs from "fs";
import path from "path";
import got from "got";
import { DataStructure } from "./doubanAnalyze.js";

export interface DownLoadImgItem {
  url: string;
  title: string;
  extname: string;
}

export const replaceSpace = (str: string) => {
  return str.replace(/[\n\s]/gi, "");
};

/**
 * 检测一个文件路径，它的上级目录是否存在，如果不存在就创建目录
 *
 * @param {string} filePath 文件路径，不是文件夹路径
 */
export const checkFilePathAndMkdir = (filePath: string) => {
  // 如果文件不存在
  if (!fs.existsSync(filePath)) {
    // 获取它的上级目录
    const tempDir = path.dirname(filePath);

    // 如果目录不存在就创建
    if (!fs.existsSync(tempDir)) {
      // 递归创建，无论目录嵌套多少层
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }
};

export const sleep = (timeout = 2500) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const downLoadImg = async (
  imgDirPath: string,
  imgArr: DownLoadImgItem[],
  timeInterval: number
) => {
  // await async 不能用forEach
  for (let i = 0; i < imgArr.length; i++) {
    const { url, title, extname } = imgArr[i];
    const filePath = path.resolve(imgDirPath, `${title + extname}`);

    checkFilePathAndMkdir(filePath);
    if (!fs.existsSync(filePath)) {
      const picStream = fs.createWriteStream(filePath);

      got
        .stream(url)
        .once("error", (err) => {
          console.log(picStream.path);
          fs.rmSync(picStream.path);
        })
        .pipe(picStream);

      console.log(`- downloaded the pic ${title}`);
      await sleep(timeInterval);
    }
  }
};

export const writeReadMe = (filePath: string, relativeImgDir: string) => {
  const data: DataStructure = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // 判断图片是否已经下载到了本地，
  const hasPic = Object.values(data).every((item) => {
    const filePath = path.resolve(
      process.cwd(),
      relativeImgDir,
      `${item.alt + item.extname}`
    );

    return fs.existsSync(filePath);
  });

  const dataSource = Object.values(data).map((item) => {
    const { rank, alt, pic, url, extname } = item;
    return { rank, alt, pic, extname, url };
  });

  writeMD(dataSource, relativeImgDir, hasPic);
};

function writeMD(dataArr: any[], relativeImgDir: string, hasPic: boolean) {
  const readMePath = path.resolve(process.cwd(), "README.md");
  let fileContent = ``;
  let title = `# doubanMovie Top250`;
  let table = `
|   |   |   |   |   |
|:-:|:-:|:-:|:-:|:-:|
@table
`;

  let tableStr = "";
  for (let i = 0; i < dataArr.length; i++) {
    const item = dataArr[i];
    tableStr += "|";
    if (hasPic) {
      tableStr += `![](${relativeImgDir + item.alt + item.extname})`;
    }
    tableStr += `[${item.rank} ${item.alt}](${item.url})`;

    if (i % 5 === 4 && i !== 0) {
      tableStr += "|\n";
    }
  }

  fileContent += title;
  table = table.replace("@table", tableStr);
  fileContent += table;

  fs.writeFileSync(readMePath, fileContent);
}
