import Axios, { AxiosInstance } from "axios";
import { stringify } from "querystring";

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
}
