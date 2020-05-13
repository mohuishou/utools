import { clipboard } from "electron";
import { CallbackListItem } from "utools-helper/@types/utools";

let Operate = {
  delete(item: CallbackListItem) {
    let res = utools.db.remove(item._id);
    let msg = "删除成功";
    if (!res.ok) msg = "删除失败: " + res.error;
    console.log(res, item);
    utools.showNotification(msg);
  },

  copy(item: CallbackListItem) {
    clipboard.writeText(item.token);
    utools.showNotification("复制成功");
  },
};

export default Operate;
