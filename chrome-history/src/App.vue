<template>
  <div id="app">
    <el-form
      v-if="code == 'mohuishou-chrome-histroy-search-setting'"
      class="form"
      label-width="150px"
      :model="setting"
    >
      <el-form-item label="Chrome Profile">
        <el-input
          @change="update"
          placeholder="请输入 chrome profile 目录地址"
          v-model="setting.path"
        ></el-input>
      </el-form-item>
      <el-form-item label="展示脚注">
        <el-switch
          @change="update"
          v-model="setting.github"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <list
      :items="items"
      :github="setting.github"
      v-else
    ></list>
    <a
      class="footer"
      v-if="setting.github"
      href="https://github.com/mohuishou/utools"
    >开源代码❤️点击收藏</a>
  </div>
</template>

<script>
import List from "./components/List.vue";
import { join } from "path";
export default {
  name: "app",
  components: {
    List
  },
  data() {
    return {
      setting: {
        path: "",
        github: true
      },
      rev: "",
      code: "",
      items: []
    };
  },

  methods: {
    update() {
      let res = utools.db.put({
        _id: "setting",
        data: this.setting,
        _rev: this.rev
      });

      console.log("update", res);
      if (res.error) {
        utools.showNotification("chrome history 设置更新失败!");
      }
      this.rev = res._rev;
    },
    init() {
      let setting = utools.db.get("setting");
      console.log(setting);

      if (!setting || !setting.data) {
        this.setting = {
          path: join(
            utools.getPath("home"),
            "/AppData/Local/Google/Chrome/User Data/Default"
          ),
          github: true
        };
        setting = utools.db.put({
          _id: "setting",
          data: this.setting,
          _rev: setting && setting._rev
        });
        this.rev = setting.rev;
      } else {
        this.rev = setting.rev;
        this.setting = setting.data;
      }
    }
  },

  created() {
    console.log("init app");
    utools.onPluginEnter(({ code }) => {
      this.init();
      this.code = code;
      console.log(code);
      if (code == "mohuishou-chrome-histroy-search-setting") {
        utools.setExpendHeight(200);
      } else {
        utools.setSubInput(async ({ text }) => {
          console.log("query: ", text);
          try {
            this.items = await Utils.search(text, this.setting.path);
          } catch (err) {
            alert(err);
          }
          console.log("items: ", this.items);
        }, "输入关键词搜索");
      }
    });
  }
};
</script>

<style>
#app {
  margin-bottom: 42px;
}
.form {
  margin: 10px;
}
.footer {
  color: #888;
  text-align: center;
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 0px;
  height: 40px;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-decoration: none;
  background: #fff;
}
</style>
