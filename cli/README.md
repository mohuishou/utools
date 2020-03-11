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
utools-cli/0.1.0 darwin-x64 node-v10.14.2
$ utools --help [COMMAND]
USAGE
  $ utools COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`utools hello [FILE]`](#utools-hello-file)
* [`utools help [COMMAND]`](#utools-help-command)

## `utools hello [FILE]`

describe the command here

```
USAGE
  $ utools hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ utools hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/mohuishou/utools/blob/v0.1.0/src/commands/hello.ts)_

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
