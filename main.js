const electron = require('electron')

function openMainWindow() {
	let window = new BrowserWindow({width: 800, height: 600})
	window.loadFile("app/index.html")
}

app.on("ready", openMainWindow)
