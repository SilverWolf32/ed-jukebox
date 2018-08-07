const {app, BrowserWindow} = require('electron')

function openMainWindow() {
	let window = new BrowserWindow({width: 800, height: 600, titleBarStyle: "hiddenInset"})
	window.loadFile("app/index.html")
}

app.on("ready", openMainWindow)
