const {app, BrowserWindow, globalShortcut, ipcMain, dialog} = require('electron')
var fs = require('fs')

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
	const options = {
		title: "Export Playlist",
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