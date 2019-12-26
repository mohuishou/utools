import Axios, { AxiosInstance } from "axios";
import { stringify } from "querystring";

class iconfont {
  request: AxiosInstance;
  private static instance: iconfont;

  private constructor(r: AxiosInstance) {
    console.log("init iconfont", new Date());
    this.request = r;
  }

  static async load(): Promise<iconfont> {
    if (this.instance) return this.instance;

    let request = Axios.create({
      baseURL: "https://www.iconfont.cn",
      timeout: 10000
    });
    let res = await request.get("");
    let cookies = res.headers["set-cookie"] as Array<string>;
    let csrf: string;
    let cookie2 = "";
    cookies.forEach(cookie => {
      cookie2 += cookie.split(";")[0] + ";";
      if (cookie.includes("ctoken")) csrf = cookie.match(/ctoken=(.*?);/)[1];
    });
    request.defaults.headers = {
      cookie: cookie2,
      "x-csrf-token": csrf,
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    };
    this.instance = new iconfont(request);
    return this.instance;
  }

  static async loadImg(src: string): Promise<HTMLImageElement> {
    let img = document.createElement("img");
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.src = src;
    });
  }

  static async svg2png(id: Number, data: string): Promise<string> {
    return (await this.svg2canvas(id, data)).toDataURL("image/png");
  }

  static async svg2canvas(
    id: Number,
    data: string
  ): Promise<HTMLCanvasElement> {
    let canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    canvas.id = "id-" + id;
    let ctx = canvas.getContext("2d");
    let img = await this.loadImg(data);
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  async search(keyword: string) {
    let data = {
      page: 1,
      pageSize: 20,
      fromCollection: -1,
      fills: 1,
      t: new Date().getTime(),
      q: keyword,
      sortType: "updated_at"
    };
    const r = await this.request.post("api/icon/search.json", stringify(data));
    let icons = r.data.data.icons.map(icon => {
      return {
        id: icon.id,
        title: icon.name.trim().replace(/\s+/g, "_"),
        description:
          "enter: 下载, command/ctrl + enter: 复制到剪切板, option/alt + enter: 浏览器打开搜索",
        icon: "data:image/svg+xml;utf8," + encodeURIComponent(icon.show_svg),
        data: icon.show_svg,
        searchUrl:
          "https://www.iconfont.cn/search/index?searchType=icon&q=" + keyword
      };
    });
    return icons;
  }
}

module.exports = iconfont;
