function dismissOverlay() {
	let overlayContainer = document.getElementById("album-chooser-overlay-container")
	overlayContainer.style.opacity = 0.0
	overlayContainer.style.visibility = "hidden"
	
	let overlay = document.getElementById("album-chooser-overlay")
	overlay.style.top = "100%" // move up
}

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
	
	{
		let albumChooserCancelButton = document.getElementById("album-chooser-cancel")
		albumChooserCancelButton.addEventListener("click", dismissOverlay)
		// keyup because keypress may not trigger for Esc key
		// see https://stackoverflow.com/a/2880614/8365799
		document.addEventListener("keyup", function(event) {
			// debugger
			event.stopPropagation() // stop propagation up the responder chain
			if (event.key == "Escape") {
				dismissOverlay()
			}
		})
	}
})()