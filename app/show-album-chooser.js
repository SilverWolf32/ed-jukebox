// define a function and call it at the same time
// allows returning
;(function() {
	// debugger
	let albumChooserButton = document.getElementById("album-chooser-button")
	albumChooserButton.onclick = function() {
		// debugger
		let overlayContainer = document.getElementById("album-chooser-overlay-container")
		overlayContainer.style.visibility = "visible"
		overlayContainer.style.opacity = 1.0
		
		// show actual overlay content
		let overlay = document.getElementById("album-chooser-overlay")
		overlay.style.top = "0%" // move up
	}
	
	let albumChooserCancelButton = document.getElementById("album-chooser-cancel")
	albumChooserCancelButton.onclick = function() {
		let overlayContainer = document.getElementById("album-chooser-overlay-container")
		overlayContainer.style.opacity = 0.0
		overlayContainer.style.visibility = "hidden"
		
		let overlay = document.getElementById("album-chooser-overlay")
		overlay.style.top = "100%" // move down
	}
})()