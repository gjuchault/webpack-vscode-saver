# webpack-vscode-saver

This extension triggers webpack-dev-server invalidation when a file is saved on VS Code.

## Principles

**Using a filesystem watcher is bad**

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

Else, feel free to open an issue but this tool might not suite your usage.
