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

## Options

Go to `Tools > Options > Combine notes`

- `Create combined note as to-do`: New note is created as To-Do. Default `false`
- `Delete combined notes`: Delete combined notes, after note creation. Default `false`
- `Preserve Source Note Titles`: Titles of source notes will be embedded in new note. Default `true`.
- `Preserve Source URL`: The source URL will be added to the new note. Default `false`
- `Preserve Created Date`: The Created Date will be added to the new note. Default `false`
- `Preserve Updated Date`: The Updated Date will be added to the new note. Default `false`
- `Preserve Location`: The Location (Latitude, Longitude, Altitude) will be added to the new note. Default `false`
- `Metadata Prefix`: The entered text is output before the metadata (URL, Date, Location).
- `Metadata Suffix`: The entered text is output after the metadata (URL, Date, Location).
- `Title of the combined note`: New title of the combined note. Default `Combined note`.
- `Custom note title`: New note title with possible variables `{{FIRSTTITLE}}`, `{{LASTTITLE}}`, `{{ALLTITLE}}` and `{{DATE}}`.

## Keyboard Shortcuts

Under `Options > Keyboard Shortcuts` you can assign a keyboard shortcut for the following commands:

- `Combine selected notes`

## Build

See [BUILD](BUILD.md)

## Changelog

See [Changelog](CHANGELOG.md)
