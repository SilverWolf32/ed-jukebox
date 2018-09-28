# ED Jukebox

A companion app for Elite: Dangerous that makes your favorite iTunes playlist responsive to in-game events.

## Status

- Playlist loading, saving, and track organization works.
- Journal reading does **not** work.
- Playback control does **not** work.

## Build setup

``` bash
# install dependencies
npm install

# running it
npm start
```

## Important Windows note

This assumes you're using Windows Subsystem for Linux (WSL). To get Electron to
install properly, you **must run `npm install` from Windows CMD, not from
within WSL**. (This means you need to install [Node][nodejs] on Windows itself.)  
Additionally, since Node.JS installs to `nodejs` instead of
`node` in WSL, you need to edit the `node_modules/.bin/electron` script to use
`nodejs`.

## Dependencies

#### Runtime dependencies
- [iTunes][itunes] for Windows ([download][itunes-download])
- [Chokidar][chokidar]

#### Compile time dependencies

- [Electron][electron]
- [Less][less]

## How it works

Elite writes game events to a "journal" file as they happen, which is used by third-party tools such as [ED-VOID][ed-void] and [EDMC][edmc]. This app uses the `Music` journal event to decide which tracks to play from iTunes.

## Credits

This app uses code from [ED-VOID][ed-void], an exploration and racing tool.

<!-- Links -->

[itunes]: https://www.apple.com/itunes/
[itunes-download]: https://www.apple.com/itunes/download/win64
[nodejs]: https://nodejs.org
[ed-void]: https://ed-void.com
[edmc]: https://github.com/Marginal/EDMarketConnector
[electron]: https://electronjs.org
[less]: https://lesscss.org
[chokidar]: https://npmjs.com/package/chokidar

