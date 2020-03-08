import { Plugin, ListItem } from "utools-helper";
import { basename } from "path";
import { Bookmarks } from "./bookmarks";

export class SourceTree implements Plugin {
  code = "sourcetree";
  bookmarks: Array<string>;
  bk: Bookmarks;

  constructor(bk: Bookmarks) {
    this.bk = bk;
  }

  async enter(): Promise<ListItem[]> {
    this.bookmarks = await this.bk.getBookMarks();
    return this.search("");
  }

  async search(word: string): Promise<ListItem[]> {
    let bookmarks = this.bookmarks;
    // 搜索
    word.split(/\s+/g).forEach(keyword => {
      bookmarks = bookmarks.filter((bookmark: string) => {
        return bookmark.toLowerCase().includes(keyword.trim().toLowerCase());
      });
    });

    return bookmarks.map(bookmark => {
      return new ListItem(basename(bookmark), bookmark);
    });
  }

  select(item: ListItem) {
    this.bk.open(item.data);
    utools.outPlugin();
    utools.hideMainWindow();
  }
}
