### Moved! => https://codeberg.org/timberwolf/ed-jukebox

# ED Jukebox

A companion app for [Elite: Dangerous][ed-official-site] that makes your favorite soundtrack responsive to in-game events.

## Status

- [x] Playlist loading, saving, and track organization
- [x] Journal reading
- [x] Playback control (shortcuts don't work on Mac)
- [x] Playback position remembered per-category
- [x] Up Next queue / history remembered per-category
- [x] Playlist import/export
- [x] App packaging

###### Unimplemented:
- [ ] Playlist mass import/export
	- As a workaround, you can access the Electron browser's developer tools (⌥⌘I on Mac, ⇧⌃I on Windows) and dig around in the local storage. But that's a pain, and it doesn't seem to work in release builds.

## Build setup

```bash
# install dependencies
npm install

# (if you changed any Less files)
# compile the Less files into CSS
# This assumes you have less installed: npm install [-g] less
# ** this script assumes a sh-style shell **
less.sh

# run it for testing; app will be called "electron" and be missing the icon
npm start

# (if you changed the icon .iconset file)
#
# copy the app icon from icon/ into build/, including
# making .icns file for Mac if iconutil is available
#
# the Windows icon is copied from icon/icon.iconset/icon_512@2x.png
#
# ** this script assumes a sh-style shell **
npm run make-icon

# build and package the standalone app
npm run dist
# you can build the Windows version on Linux using Wine, if you're so inclined
npm run dist-win
```

If you're on Windows, you'll also need to see [Build Setup for Windows](#build-setup-for-windows).

## Build setup for Windows

To build a packaged .exe for Windows, you need to run `npm run dist` from Windows CMD. (If you run it from within WSL, you'll get a Linux build.)

This means **you need to install [Node][nodejs] on Windows itself**.

You should probably run `npm install` from Windows CMD as well.

If running `npm run dist` crashes from Windows CMD, run `npm run dist-winspaces` instead. NPM on Windows seems to crash if you have spaces in your home folder name; the dist-win script works around that by bypassing NPM and running electron-builder directly.

#### (Optional, but helpful for CSS) Getting WSL -- Windows Subsystem for Linux

Microsoft has [official instructions](https://docs.microsoft.com/en-us/windows/wsl/install-win10) for installing WSL.

- Open PowerShell as root (right-click > Run as Administrator, not simply as an admin user) and run this:
```
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```
- Reboot.
- Go to the Windows Store and install [the Ubuntu app](https://www.microsoft.com/store/p/ubuntu/9nblggh4msv6).
- [Initialize your WSL install](https://docs.microsoft.com/en-us/windows/wsl/initialize-distro):
	- Open the new Ubuntu app and finish setting it up.

## Dependencies

#### Runtime dependencies
- [Chokidar][chokidar]

#### Compile time dependencies

- [electron-builder](electron-builder) (installs Electron automatically)
- [Less][less] if you want to change the CSS

## How it works

Elite writes game events to a "journal" file as they happen, which is used by third-party tools such as [EDMC][edmc]. This app uses the `Music` journal event to decide which tracks to play.

## License

ED Jukebox is in the public domain. You can use it under the terms of the Unlicense (it contains a fallback for when the public domain is not available) or the MIT license, your choice.

- [COPYING.md](COPYING.md)
- [COPYING.MIT.md](COPYING.MIT.md)

This does _[not](app/icons/octicons/LICENSE.md)_ apply to anything in [app/icons/octicons](app/icons/octicons). Those are MIT-licensed.

<!-- Links -->

[ed-official-site]: https://elitedangerous.com
[nodejs]: https://nodejs.org
[edmc]: https://github.com/Marginal/EDMarketConnector
[electron]: https://electronjs.org
[electron-builder]: https://electron.build
[less]: https://lesscss.org
[chokidar]: https://npmjs.com/package/chokidar
