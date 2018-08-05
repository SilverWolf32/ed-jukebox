# ED iTunes Controller

A companion app for Elite: Dangerous that makes your favorite iTunes playlist responsive to in-game events.

## Status

Nothing works yet.

## Dependencies

#### Runtime dependencies
- [iTunes](https://www.apple.com/itunes/) for Windows ([download](https://www.apple.com/itunes/download/win64))

#### Compile time dependencies

- [Electron](https://electronjs.org)

## How it works

Elite writes game events to a "journal" file as they happen, which is used by third-party tools such as [ED-VOID][ed-void] and [EDMC][edmc]. This app uses the `Music` journal event to decide which tracks to play from iTunes.

## Credits

This app uses code from [ED-VOID](https://ed-void.com), an exploration and racing tool.

<!-- Links -->

[ed-void]: https://ed-void.com
[edmc]: https://github.com/Marginal/EDMarketConnector