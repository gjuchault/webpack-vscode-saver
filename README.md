# webpack-vscode-saver

This extension triggers webpack-dev-server invalidation when a file is saved on VS Code.

## Principles

**Using a filesystem watcher is unnecessary**

- It uses some watching APIs that [can be CPU-vore](https://github.com/paulmillr/chokidar#why)
- It's irrelevant: your editor is the one responsible for file changes _most of the time_
- It is not compatible with [some systems](https://webpack.js.org/configuration/dev-server/#devserverwatchoptions-)

**This extension shall not adapt to all toolchains**

Even if there are some automatic wds server configuration discovery, this tool shall not have more than a few: it binds us to the toolchain breaking changes (create-react-app, vue-cli, etc.). A good configuration file is better than dozens of guessers modules that we need to maintain.

## Usage

1. Install the extension
2. Create a settings file (`[webpack-dev-server] Create settings file for this workspace`). It will try to guess the webpack-dev-server endpoint from your configuration (create-react-app, vue-cli, webpack.config.js)
3. Disable file watching on `webpack-dev-server` by using the following configuration:

```
watchOptions: {
    poll: Infinity,
    ignored: /.*/
}
```

When a file is saved, a request will be made to `http://yourdevserver/webpack-dev-server/invalidate` which asks webpack-dev-server to incrementally builds your project

Rest of the time, you will have <5% CPU usage by webpack-dev-server

## What if I change the folder content outside VS Code

If this happens because of your package manager, you can rebuild manually with the command `[webpack-dev-server] Trigger build`

You can also use specific regex in your webpack-dev-server file:

```
watchOptions: {
    poll: Infinity,
    // only watch non-node-modules yarn.lock
    ignored: /(node_modules)|(.+(?<!yarn\.lock)$)/
}
```

Else, feel free to open an issue but this tool might not suite your usage.

## Configuring webpack-vscode-server

First, run the command `[webpack-dev-server] Create settings file for this workspace`

You will get a file with the following type definition:

```ts
type WvsSettings = {
  include: string[];
  exclude: string[];
  wdsServer: string;
}[];
```

`include` and `exclude` are patterns following the [gitignore pattern](https://git-scm.com/docs/gitignore#_pattern_format).
This format is the same used by eslint, prettier, etc.

### Example for a single package repository:

```
[
    {
        "include": ["*"],
        "exclude": ["node_modules"],
        "wdsServer": "http://localhost:8080/"
    }
]
```

While you can exclude `node_modules`, it is totally useless: as there is no file-watching mechanism, you don't have to limit the number of files matching the include.

Example for a mono-repo workspace:

```
[
    {
        "include": ["packages/package-1"],
        "exclude": [],
        "wdsServer": "http://localhost:8081/"
    },
    {
        "include": ["packages/package-2"],
        "exclude": [],
        "wdsServer": "http://localhost:8082/"
    },
    {
        "include": ["packages/package-3"],
        "exclude": [],
        "wdsServer": "http://localhost:8083/"
    }
]
```
