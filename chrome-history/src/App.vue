<template>
  <div id="app">
    <el-form v-if="isSetting"
             class="form"
             label-width="150px"
             :model="setting">
      <el-form-item label="Command">
        <el-input @change="update"
                  placeholder="请输入可执行程序路径"
                  v-model="setting.command"></el-input>
        <el-link type="info"
                 @click="open('https://github.com/mohuishou/utools/releases/latest')">点击下载最新版本</el-link>
      </el-form-item>
      <el-form-item label="Chrome Profile">
        <el-input @change="update"
                  placeholder="请输入 chrome profile 目录地址"
                  v-model="setting.path"></el-input>
      </el-form-item>
      <el-form-item label="展示脚注">
        <el-switch @change="update"
                   v-model="setting.github">
        </el-switch>
      </el-form-item>
    </el-form>
    <list :items="items"
          :github="setting.github"
          v-else></list>
    <a class="footer"
       v-if="setting.github"
       @click="open('https://github.com/mohuishou/utools')">开源代码❤️点击收藏
    </a>
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

  computed: {
    isSetting () {
      return this.code == "mohuishou-chrome-histroy-search-setting"
    }
  },
  data () {
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
    update () {
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
    open (url) {
      Utils.openBrowser(url)
    },
    getDefault () {
      switch (Utils.platform) {
        case "win32":
          return join(
            utools.getPath("home"),
            "/AppData/Local/Google/Chrome/User Data/Default"
          )
        case "darwin":
          return join(
            utools.getPath("appData"),
            "/Google/Chrome/Default"
          )
      }
    },
    init () {
      let setting = utools.db.get("setting");
      if (!setting || !setting.data) {
        this.setting = {
          path: this.getDefault(),
          github: true
        };
        console.log(this.setting);

        setting = utools.db.put({
          _id: "setting",
          data: this.setting,
          _rev: setting && setting._rev
        });
        this.rev = setting._rev;
      } else {
        this.rev = setting._rev;
        this.setting = setting.data;
      }

      if (!this.isSetting && !this.setting.command) {
        console.log(this.code);

        alert("请先执行: ch-setting 设置可执行程序路径")
        throw new Error("请先执行: ch-setting 设置可执行程序路径")
      }
    }
  },

  created () {
    console.log("init app");
    utools.onPluginEnter(({ code }) => {
      this.code = code;
      this.init();

      if (this.isSetting) {
        utools.setExpendHeight(300);
      } else {
        utools.setSubInput(async ({ text }) => {
          console.log("query: ", text);
          try {
            this.items = await Utils.search(this.setting.command, text, this.setting.path);
          } catch (err) {
            alert(err);
          }
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

.info {
  color: ;
}
</style>
