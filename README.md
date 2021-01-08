# Joplin Combine notes

Plugin to combine one or more notes to a new one.

<img src=img/main.jpg>

## Installation

### Automatic

- Go to `Tools > Options > Plugins`
- Search for `combine-notes`
- Click Install plugin
- Restart Joplin to enable the plugin

### Manual

- Download the latest released JPL package (`io.github.jackgruber.combine-notes.jpl`) from [here](https://github.com/JackGruber/joplin-plugin-combine/releases/latest)
- Close Joplin
- Copy the downloaded JPL package in your profile `plugins` folder
- Start Joplin

## Usage

- Select multiple notes to be combined into a new one
- Click on `Tools > Combine selected notes` or use the command `Combine selected notes` from the context menu

## Keyboard Shortcus

Under `Options > Keyboard Shortcus` you can assign a keyboard shortcut for the following commands:

- `Combine selected notes`

## Build

To build your one version of the plugin, install node.js and run the following command `npm run dist`

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

## Changelog

### v0.1.0 (2021-01-08)

- First version

## Links

- [Joplin - Getting started with plugin development](https://joplinapp.org/api/get_started/plugins/)
- [Joplin - Plugin API reference](https://joplinapp.org/api/references/plugin_api/classes/joplin.html)
- [Joplin - Data API reference](https://joplinapp.org/api/references/rest_api/)
- [Joplin - Plugin examples](https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins)
