import Axios, { AxiosInstance } from "axios";

export class TickTick {
  http: AxiosInstance;

  constructor(cookie: string) {
    this.http = Axios.create({
      headers: {
        cookie: cookie,
      },
      adapter: require("axios/lib/adapters/http"),
      baseURL: "https://api.dida365.com/api/v2",
    });
  }

  async getTasks() {
    this.http.get("/batch/check/0");
  }
}
