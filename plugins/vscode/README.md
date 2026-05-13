# VSCode 历史项目搜索插件

> 快速搜索并打开 VS Code 及所有基于 VS Code 开发的 IDE 的历史项目

## ✨ 功能特性

- 🔍 **快速搜索**：支持搜索所有基于 VS Code 开发的 IDE 的历史项目
- 🚀 **一键打开**：直接在对应 IDE 中打开项目
- 📦 **多 IDE 支持**：支持 VS Code、Cursor 等所有基于 VS Code 的 IDE
- 🗂️ **多种项目类型**：支持本地文件夹、工作区、远程项目（WSL/SSH）、单个文件
- 🧹 **记录管理**：支持删除单条记录、批量清理无效记录
- 🎨 **智能图标**：根据文件类型自动显示对应图标
- ⚙️ **灵活配置**：支持自定义命令、终端、数据库路径等

## 📥 安装方法

1. 打开 uTools 设置 → 插件市场
2. 搜索 `vscode` 或 `VSCode 历史项目搜索`
3. 点击安装

## 🚀 使用方法

### 基础使用

1. **搜索 VS Code 历史项目**：唤起 uTools，输入 `vsc` 或 `vscode`
2. **搜索 Cursor 历史项目**：输入 `cursor`
3. **搜索其他 IDE**：输入对应的 IDE 命令名称

### 搜索技巧

- **关键词搜索**：输入关键词过滤项目（支持多个关键词，空格分隔）
- **删除模式**：输入 `-rm` 进入删除模式，可删除指定历史记录
- **清理模式**：输入 `-clean` 进入清理模式，自动识别并批量清理无效路径

示例：
```
vsc react -rm        # 搜索包含 react 的项目，并进入删除模式
vsc -clean          # 清理所有无效的 VS Code 历史记录
```

### 管理 IDE

#### 添加新 IDE

1. 唤起 uTools，输入 `vsc-add-ide` 或 `新增 IDE`
2. 输入 IDE 名称（建议输入终端命令名，如 `cursor`）
3. 按回车确认
4. 输入 `{ide名称}-setting` 进行配置（如 `cursor-setting`）

#### 查看/删除 IDE

1. 唤起 uTools，输入 `vsc-ide`
2. 选择要删除的 IDE，确认即可删除

#### 配置 IDE

输入 `{ide名称}-setting` 进行配置，如：
- `vsc-setting`：配置 VS Code
- `cursor-setting`：配置 Cursor

**配置项说明**：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `code` | IDE 识别码 | `vsc`、`cursor` |
| `icon` | 图标路径（必须是 png 格式） | `icon/cursor.png` |
| `command` | IDE 启动命令 | `code`、`cursor` |
| `terminal` | 终端命令（macOS/Linux） | `zsh -l -c`（默认） |
| `database` | 历史记录数据库路径 | `~/.config/Code/User/globalStorage/state.vscdb` |
| `timeout` | 启动超时时间（毫秒） | `3000` |

## 📝 常见问题

### 1. 如何找到 IDE 的数据库路径？

大多数基于 VS Code 的 IDE 历史记录存储在：

**macOS**:
```
~/Library/Application Support/{IDE名称}/User/globalStorage/state.vscdb
```

**Windows**:
```
%APPDATA%\{IDE名称}\User\globalStorage\state.vscdb
```

**Linux**:
```
~/.config/{IDE名称}/User/globalStorage/state.vscdb
```

### 2. VS Code 1.118+ 版本历史记录在哪里？

VS Code 1.118+ 版本使用了共享存储，路径为：
```
~/.vscode-shared/sharedStorage/state.vscdb
```

插件会自动检测并使用此路径。

### 3. 删除历史记录时报错 "WAL 文件存在"？

这是因为 VS Code 正在运行，数据库存在未提交的 WAL 文件。请先关闭 VS Code，或等待 VS Code 自动检查点后再试。

### 4. 如何支持更多的文件类型图标？

在 `icon` 目录下添加对应扩展名的 SVG 图标文件即可，例如 `py.svg` 用于 Python 文件。

## 🔧 技术实现

- 使用 `sql.js` 读取 VS Code 的 SQLite 数据库
- 支持 WAL 文件解析，可以读取最新的未提交数据
- 支持 VS Code Shared Storage，多版本 VS Code 共享历史记录
- 跨平台支持（Windows、macOS、Linux）

## 🔗 相关链接

- 开源地址：https://github.com/mohuishou/utools
- 问题反馈：https://github.com/mohuishou/utools/issues
- uTools 官网：https://u.tools/

## 🙏 贡献

欢迎提交 Issue 和 Pull Request！
