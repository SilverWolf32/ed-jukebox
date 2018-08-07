// define a function and call it at the same time
// allows returning
;(function() {
	debugger
	let albumChooserButton = document.getElementById("album-chooser-button")
	albumChooserButton.onclick = function() {
		debugger
		let overlay = document.getElementById("album-chooser-overlay-container")
		overlay.style.visibility = "visible"
		overlay.style.opacity = 1.0
	}
})()