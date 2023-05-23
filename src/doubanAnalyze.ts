import fs from "fs";
import path from "path";
import { load } from "cheerio";
import { checkFilePathAndMkdir, downLoadImg, replaceSpace } from "./utils.js";
import { Analyzer } from "./crowller.js";

export interface DataStructure {
  [key: string]: DataItem;
}

export interface DataItem {
  rank: number;
  title: string;
  pic: string;
  extname: string;
  alt: string;
  url: string;
  star: number;
  quote: string;
}

export class DoubanAnalyze implements Analyzer {
  private movieInfo: DataItem[] = [];

  private getMovieInfo(html: string) {
    const $ = load(html);
    const items = $(".grid_view > li");
    const resultArr: DataItem[] = [];

    items.each((i, el) => {
      const $el = $(el);
      const rank = Number($el.find(".item .pic em").text());
      const pic = $el.find(".item .pic img").attr("src") as string;
      const alt = replaceSpace(
        $el.find(".item .pic img").attr("alt") as string
      );
      const title = replaceSpace($el.find(".item .info .hd > a").text());
      const url = $el.find(".item .info .hd > a").attr("href") as string;
      const star = Number($el.find(".item .info .bd .star .rating_num").text());
      const quote = replaceSpace($el.find(".item .info .bd .quote").text());

      const extname = path.extname(pic);

      resultArr.push({
        rank,
        pic,
        extname,
        alt,
        title,
        url,
        star,
        quote,
      });
    });
    return resultArr;
  }

  private generatorFileContent(filePath: string, data: DataItem[]) {
    checkFilePathAndMkdir(filePath);

    let fileContent: DataStructure = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    data.forEach((item) => {
      fileContent[item.rank] = item;
    });

    return fileContent;
  }

  public analyzer(filePath: string, html: string): string {
    this.movieInfo = this.getMovieInfo(html);
    const fileContent = this.generatorFileContent(filePath, this.movieInfo);

    return JSON.stringify(fileContent);
  }

  public async downLoadPic(
    imgDirPath: string,
    timeInterval: number
  ): Promise<void> {
    const dataSource = this.movieInfo.map((movie) => {
      const { pic, alt, extname } = movie;
      return {
        url: pic,
        title: alt,
        extname,
      };
    });

    await downLoadImg(imgDirPath, dataSource, timeInterval);
  }
}
