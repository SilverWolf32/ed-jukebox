# ED iTunes Controller

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
within WSL**. (This means you need to install [Node](https://nodejs.org) on Windows itself.)  
Additionally, since Node.JS installs to `nodejs` instead of
`node` in WSL, you need to edit the `node_modules/.bin/electron` script to use
`nodejs`.

## Dependencies

#### Runtime dependencies
- [iTunes](https://www.apple.com/itunes/) for Windows ([download](https://www.apple.com/itunes/download/win64))

#### Compile time dependencies

- [Electron](https://electronjs.org)
- [Less](https://lesscss.org)

## How it works

Elite writes game events to a "journal" file as they happen, which is used by third-party tools such as [ED-VOID][ed-void] and [EDMC][edmc]. This app uses the `Music` journal event to decide which tracks to play from iTunes.

## Credits

This app uses code from [ED-VOID](https://ed-void.com), an exploration and racing tool.

<!-- Links -->

[ed-void]: https://ed-void.com
[edmc]: https://github.com/Marginal/EDMarketConnector
