utools-cli
==========

utools command helper

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/utools-cli.svg)](https://npmjs.org/package/utools-cli)
[![Downloads/week](https://img.shields.io/npm/dw/utools-cli.svg)](https://npmjs.org/package/utools-cli)
[![License](https://img.shields.io/npm/l/utools-cli.svg)](https://github.com/mohuishou/utools/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g utools-cli
$ utools COMMAND
running command...
$ utools (-v|--version|version)
utools-cli/0.1.1 darwin-x64 node-v10.14.2
$ utools --help [COMMAND]
USAGE
  $ utools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`utools doc [OUTPUT]`](#utools-doc-output)
* [`utools help [COMMAND]`](#utools-help-command)

## `utools doc [OUTPUT]`

文档生成器，将markdown等文档，自动转化为utools文档插件

```
USAGE
  $ utools doc [OUTPUT]

OPTIONS
  -h, --help           show CLI help
  -p, --plugin=plugin  plugin.json path

EXAMPLE
  $ utools doc -p plugin.json public
```

_See code: [src/commands/doc.ts](https://github.com/mohuishou/utools/blob/v0.1.1/src/commands/doc.ts)_

## `utools help [COMMAND]`

display help for utools

```
USAGE
  $ utools help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
