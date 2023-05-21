import path from "path";
import fs from "fs";
import superagent from "superagent";

export interface Analyzer {
  analyzer: (filePath: string, html: string) => string;
  downLoadPic: (imgDirPath: string, timeInterval: number) => Promise<void>;
}

interface CrowllerConfig {
  destDir: string;
  dataJsonFile: string;
  dataImgDir: string;
  downLoadPic: boolean;
  timeInterval: number;
}

export class Crowller {
  private config: CrowllerConfig = {
    destDir: "data",
    dataJsonFile: "movieData.json",
    dataImgDir: "imgs",
    downLoadPic: false,
    timeInterval: 5000,
  };

  public get dataJsonFile(): string {
    return path.resolve(
      process.cwd(),
      this.config.destDir,
      this.config.dataJsonFile
    );
  }

  public get dataImgDir(): string {
    return path.resolve(
      process.cwd(),
      this.config.destDir,
      this.config.dataImgDir
    );
  }

  public set setUrl(url: string) {
    this.url = url;
  }

  constructor(
    private url: string,
    private analyzer: Analyzer,
    config: Partial<CrowllerConfig>
  ) {
    this.config = Object.assign(this.config, config);
  }

  // 发送http请求，获取原始数据
  private async fetchData() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  // 写入文件
  private writeFile(fileContent: string) {
    fs.writeFileSync(this.dataJsonFile, fileContent);
  }

  // 可选，下载图片（如果有）
  private async savePic() {
    await this.analyzer.downLoadPic(this.dataImgDir, this.config.timeInterval);
  }

  public async bootstrap() {
    const html = await this.fetchData();
    const data = this.analyzer.analyzer(this.dataJsonFile, html);

    this.writeFile(data);
    console.log("@ data write end");

    if (this.config.downLoadPic) {
      console.log("@ start download img");
      await this.savePic();
      console.log("@ img downloaded");
    }
  }
}
