const fs = require("fs");
const path = require("path");
class AddVendorPlugin {
  constructor(outputs) {
    this.outputs = outputs;
  }
  apply(compiler) {
    // tap(触及) 到 compilation hook，而在 callback 回调时，会将 compilation 对象作为参数，
    compiler.hooks.afterEmit.tap("AddVendorPlugin", compilation => {
      // 现在，通过 compilation 对象，我们可以 tap(触及) 到各种可用的 hooks 了
      this.outputs.forEach(output => {
        let files = fs
          .readdirSync(output)
          .filter(file => file != "runtime.js" && path.extname(file) === ".js");
        fs.writeFileSync(path.join(output, "runtime.js"), this.runtime(files));
      });
    });
  }

  runtime(files) {
    let requires = [];
    files.forEach(file => {
      requires.push(`require("./${file}").modules`);
    });

    return `
    (function(modules) {
      // webpackBootstrap
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
          return installedModules[moduleId].exports;
        }
        var module = (installedModules[moduleId] = {
          i: moduleId,
          l: false,
          exports: {}
        });
    
        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
        // Flag the module as loaded
        module.l = true;
    
        // Return the exports of the module
        return module.exports;
      }
    
      // expose the modules object (__webpack_modules__)
      __webpack_require__.m = modules;
    
      // expose the module cache
      __webpack_require__.c = installedModules;
    
      // define getter function for harmony exports
      __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
          Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
      };
    
      // define __esModule on exports
      __webpack_require__.r = function(exports) {
        if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
          Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
        }
        Object.defineProperty(exports, "__esModule", { value: true });
      };
    
      // create a fake namespace object
      // mode & 1: value is a module id, require it
      // mode & 2: merge all properties of value into the ns
      // mode & 4: return value when already ns object
      // mode & 8|1: behave like require
      __webpack_require__.t = function(value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, "default", { enumerable: true, value: value });
        if (mode & 2 && typeof value != "string")
          for (var key in value)
            __webpack_require__.d(
              ns,
              key,
              function(key) {
                return value[key];
              }.bind(null, key)
            );
        return ns;
      };
    
      // getDefaultExport function for compatibility with non-harmony modules
      __webpack_require__.n = function(module) {
        var getter =
          module && module.__esModule
            ? function getDefault() {
                return module["default"];
              }
            : function getModuleExports() {
                return module;
              };
        __webpack_require__.d(getter, "a", getter);
        return getter;
      };
    
      // Object.prototype.hasOwnProperty.call
      __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
    
      // __webpack_public_path__
      __webpack_require__.p = "";

      let keys = Object.keys(modules).filter(m => m.includes("preload"));
      modules[keys[0]](module, exports, __webpack_require__);
    })(Object.assign(${requires.join(",")}));
    `;
  }
}

module.exports = AddVendorPlugin;
