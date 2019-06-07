const {app, BrowserWindow, globalShortcut, ipcMain, dialog} = require('electron')
var fs = require('fs')

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required")

function openMainWindow() {
	let window = new BrowserWindow({
		width: 800,
		height: 600,
		titleBarStyle: "hiddenInset",
		darkTheme: true,
		backgroundColor: "#101010"
	});
	window.loadFile("app/index.html");
}

app.on("ready", openMainWindow);
app.on("will-quit", function() {
	globalShortcut.unregisterAll()
})

ipcMain.on("export-playlist", function(event, playlistData) {
	// console.log("Displaying save dialog for playlist: "+playlistData)
	let title = JSON.parse(playlistData).name
	const options = {
		title: "Export Playlist",
		defaultPath: title,
		filters: [
			{
				name: "JSON",
				extensions: ["json"]
			}
		]
	}
	dialog.showSaveDialog(options, function(path) {
		if (!path) {
			return // canceled
		}
		console.log("Writing "+playlistData+" to "+path)
		fs.writeFileSync(path, playlistData)
	})
})

ipcMain.on("start-import-playlist", function(event) {
	console.log("Showing open panel")
	const options = {
		multiSelections: true,
		filters: [
			{
				name: "JSON",
				extensions: ["json"]
			}
		]
	}
	let paths = dialog.showOpenDialog(options)
	console.log("Selected paths: "+JSON.stringify(paths))
	event.sender.send("import-playlist-paths", paths)
})
