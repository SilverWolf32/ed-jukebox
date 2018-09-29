const {app, BrowserWindow, globalShortcut} = require('electron')

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