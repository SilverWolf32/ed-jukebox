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
	
	let albumChooserCancelButton = document.getElementById("album-chooser-cancel")
	albumChooserCancelButton.onclick = function() {
		let overlay = document.getElementById("album-chooser-overlay-container")
		overlay.style.opacity = 0.0
		overlay.style.visibility = "hidden"
	}
})()