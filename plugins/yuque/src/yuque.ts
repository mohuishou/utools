import Axios, { AxiosInstance } from "axios";
import { stringify } from "querystring";
import { generate } from "randomstring";
import { createHmac } from "crypto";

interface SearchParams {
  type?:
    | "topic"
    | "repo"
    | "doc"
    | "artboard"
    | "group"
    | "user"
    | "attachment";
  q: string;
  offset?: string;
  related?: string;
  [key: string]: string;
}

interface GetDocParams {
  namespace: string;
  slug: string;
  raw?: "1";
  [key: string]: string;
}

export class Client {
  private http: AxiosInstance;

  baseURL = "https://www.yuque.com/api/v2";

  constructor(token: string) {
    this.http = Axios.create({
      baseURL: this.baseURL,
      headers: {
        "X-Auth-Token": token,
      },
    });
  }

  async search(params: SearchParams) {
    if (!params.related) params.related = "true";
    if (!params.type) params.type = "doc";
    let res = await this.http.get("/search?" + stringify(params));
    return res.data;
  }

  async getDoc(params: GetDocParams) {
    let res = await this.http.get(
      `/repos/${params.namespace}/docs/${params.slug}?raw=${params.raw}`
    );
    return res.data;
  }

  async createDoc() {}

  // 更新知识库目录
  async updateRepo() {}
}

export class oauth {
  code: string;
  clientID = "";
  clientSecret = "";
  scope = "repo,doc";
  ts = new Date().getTime();

  constructor(clientID: string, clientSecret: string) {
    this.code = generate({
      length: 40,
      charset: "1234567890qwertyuiopasdfghjklzxcvb",
    });
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  get query(): any {
    return {
      code: this.code,
      client_id: this.clientID,
      response_type: "code",
      scope: this.scope,
      timestamp: this.ts,
    };
  }

  get sign(): string {
    const signString = [
      "client_id",
      "code",
      "response_type",
      "scope",
      "timestamp",
    ]
      .map((key) => `${key}=${encodeURIComponent(this.query[key] || "")}`)
      .join("&");
    console.log(signString);
    return createHmac("sha1", this.clientSecret)
      .update(signString)
      .digest()
      .toString("base64");
  }

  async auth() {
    let params = this.query;
    params.sign = this.sign;
    console.log(params);

    await utools.ubrowser
      .show()
      .devTools()
      .goto("https://www.yuque.com/oauth2/authorize?" + stringify(params))
      .wait("#ReactApp  div.authorized-container  h1", 1000 * 60 * 2)
      .wait(() => {
        let auth = document.querySelector(
          "#ReactApp  div.authorized-container  h1"
        );
        return auth.textContent.trim() == "授权成功";
      }, 1000 * 2)
      .hide()
      .run({show: true});
  }

  async token(): Promise<string> {
    await this.auth();
    let res = await Axios.post("https://www.yuque.com/oauth2/token", {
      grant_type: "client_code",
      client_id: this.clientID,
      code: this.code,
    });
    return res.data.access_token;
  }
}
