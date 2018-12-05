# ED Jukebox

A companion app for [Elite: Dangerous][ed-official-site] that makes your favorite soundtrack responsive to in-game events.

## Status

- [x] Playlist loading, saving, and track organization
- [x] Journal reading
- [x] Playback control (shortcuts don't work on Mac)
- [x] Playback position remembered per-category
- [x] Up Next queue / history remembered per-category
- [ ] Crossfade
- [ ] Playlist import/export
	- As a workaround, you can access the Electron browser's developer tools (⌥⌘I on Mac, ⇧⌃I on Windows) and dig around in the local storage. But that's a _pain_.
- [ ] App packaging

## Build setup

```bash
# install dependencies
npm install

# run it
npm start
```

If you're on Windows, you'll also need to see [Build Setup for Windows](#build-setup-for-windows).

There is currently no packaging infrastructure set up (you just run `npm start` every time). If you take the time to set this up yourself, please send a pull request!

## Build setup for Windows

_This assumes you're using Windows Subsystem for Linux (WSL)._

To get Electron to install properly, you **must run `npm install` from Windows CMD, not from within WSL**. (This means you need to install [Node][nodejs] on Windows itself.)  
Additionally, since Node.JS installs to `nodejs` instead of `node` in WSL, you need to edit the `node_modules/.bin/electron` script to use `nodejs`.

## Dependencies

#### Runtime dependencies
- [Chokidar][chokidar]

#### Compile time dependencies

- [Electron][electron]
- [Less][less]

## How it works

Elite writes game events to a "journal" file as they happen, which is used by third-party tools such as [ED-VOID][ed-void] and [EDMC][edmc]. This app uses the `Music` journal event to decide which tracks to play.

## License

ED Jukebox is in the public domain. You can use it under the terms of the Unlicense (it contains a fallback for when the public domain is not available) or the MIT license, your choice.

- [COPYING.md](COPYING.md)
- [COPYING.MIT.md](COPYING.MIT.md)

<!-- Links -->

[ed-official-site]: https://elitedangerous.com
[nodejs]: https://nodejs.org
[ed-void]: https://ed-void.com
[edmc]: https://github.com/Marginal/EDMarketConnector
[electron]: https://electronjs.org
[less]: https://lesscss.org
[chokidar]: https://npmjs.com/package/chokidar
