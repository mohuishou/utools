<template @keyup.down="down">
  <div class="items">
    <div
      v-for="(item, index) in items"
      class="item"
      :class="{active: active == index}"
      :key="item.id"
      ref="items"
    >
      <div class="icon"></div>
      <div class="content">
        <div class="title">{{ item.title }}</div>
        <div class="sub-title">{{ item.url }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      maxClientLen: 8
    };
  },
  props: {
    items: Array,
    github: Boolean
  },
  watch: {
    items: function() {
      window.scroll(0, 0);
      this.active = 0;
      setTimeout(() => {
        let items = document.querySelector(".items");
        let h = items && items.clientHeight;

        let item = document.querySelector(".item");
        let len = item && item.clientHeight;
        let length = Math.max(Math.min(this.maxClientLen * len, h), 1);
        if (this.github) {
          length += 40;
          console.log("xxx", length);
        }
        utools.setExpendHeight(length);
      }, 300);
    },
    active: function(val, old) {
      let height = document.documentElement.clientHeight;
      let active = this.$refs.items[val];
      let rect = active.getBoundingClientRect();
      console.log(
        val,
        height,
        rect,
        active.offsetTop,
        document.documentElement.scrollHeight
      );

      if (rect.bottom + active.clientHeight >= height) {
        console.log(rect.height);
        window.scrollBy({
          top: rect.height
        });
      }
      if (rect.top <= 0) {
        window.scrollBy({
          top: -rect.height
        });
      }
    }
  },
  methods: {
    keybordEventHandler(event) {
      event.preventDefault();
      const handlers = {
        "38": this.keyUp,
        "40": this.keyDown,
        "13": this.keyEnter
        // '37': this.keyLeft,
        // '39': this.keyRight
      };
      const handler = handlers[event.which];
      handler && handler();
    },
    keyDown() {
      if (this.active + 1 < this.items.length) {
        this.active++;
      }
    },
    keyUp() {
      if (this.active - 1 >= 0) {
        this.active--;
      }
    },
    async keyEnter() {
      console.log(this.items[this.active].url);
      await Utils.openBrowser(this.items[this.active].url);
    },
    scrollFunc(evt) {
      evt = evt || window.event;
      if (evt.preventDefault) {
        // Firefox
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        // IE
        evt.cancelBubble = true;
        evt.returnValue = false;
      }
      return false;
    }
  },
  destroyed() {
    document.removeEventListener("keydown", this.keybordEventHandler);
  },
  mounted() {
    document.addEventListener("keydown", this.keybordEventHandler);
    window.onmousewheel = this.scrollFunc;
  }
};
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
}
.item {
  /* height: 60px; */
  /* border: 1px solid #000; */
  text-align: left;
  line-height: 200%;
  padding: 5px 20px;
  border-bottom: 1px solid #eee;
}

.title {
  color: #333;
  font-size: 15px;
  font-weight: bold;
  width: 100%;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-title {
  color: #888;
  display: block;
  width: 100%;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active {
  background: #eee;
}
</style>

