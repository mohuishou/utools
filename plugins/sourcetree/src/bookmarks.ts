export interface Bookmarks {
  getBookMarks(): Promise<Array<string>>;
  open(path: string): void;
}
