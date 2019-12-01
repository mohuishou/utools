"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var querystring_1 = require("querystring");
var iconfont = /** @class */ (function () {
    function iconfont(r) {
        console.log("init iconfont", new Date());
        this.request = r;
    }
    iconfont.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, res, cookies, csrf, cookie2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.instance)
                            return [2 /*return*/, this.instance];
                        request = axios_1["default"].create({
                            baseURL: "https://www.iconfont.cn",
                            timeout: 10000
                        });
                        return [4 /*yield*/, request.get("")];
                    case 1:
                        res = _a.sent();
                        cookies = res.headers["set-cookie"];
                        cookie2 = "";
                        cookies.forEach(function (cookie) {
                            cookie2 += cookie.split(";")[0] + ";";
                            if (cookie.includes("ctoken"))
                                csrf = cookie.match(/ctoken=(.*?);/)[1];
                        });
                        request.defaults.headers = {
                            cookie: cookie2,
                            "x-csrf-token": csrf,
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        };
                        this.instance = new iconfont(request);
                        return [2 /*return*/, this.instance];
                }
            });
        });
    };
    iconfont.loadImg = function (src) {
        return __awaiter(this, void 0, void 0, function () {
            var img;
            return __generator(this, function (_a) {
                img = document.createElement("img");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        img.onload = function () { return resolve(img); };
                        img.src = src;
                    })];
            });
        });
    };
    iconfont.svg2png = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.svg2canvas(id, data)];
                    case 1: return [2 /*return*/, (_a.sent()).toDataURL("image/png")];
                }
            });
        });
    };
    iconfont.svg2canvas = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx, img;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = document.createElement("canvas");
                        canvas.width = 300;
                        canvas.height = 300;
                        canvas.id = "id-" + id;
                        ctx = canvas.getContext("2d");
                        return [4 /*yield*/, this.loadImg(data)];
                    case 1:
                        img = _a.sent();
                        ctx.drawImage(img, 0, 0);
                        return [2 /*return*/, canvas];
                }
            });
        });
    };
    iconfont.prototype.search = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var data, r, icons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {
                            page: 1,
                            pageSize: 20,
                            fromCollection: -1,
                            fills: 1,
                            t: new Date().getTime(),
                            q: keyword,
                            sortType: "updated_at"
                        };
                        return [4 /*yield*/, this.request.post("api/icon/search.json", querystring_1.stringify(data))];
                    case 1:
                        r = _a.sent();
                        icons = r.data.data.icons.map(function (icon) {
                            return {
                                id: icon.id,
                                title: icon.name.trim().replace(/\s+/g, "_"),
                                description: "enter: 下载, command/ctrl + enter: 复制到剪切板, option/alt + enter: 浏览器打开搜索",
                                icon: "data:image/svg+xml;utf8," + encodeURIComponent(icon.show_svg),
                                data: icon.show_svg,
                                searchUrl: "https://www.iconfont.cn/search/index?searchType=icon&q=" + keyword
                            };
                        });
                        return [2 /*return*/, icons];
                }
            });
        });
    };
    return iconfont;
}());
module.exports = iconfont;
