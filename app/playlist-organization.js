// debugger

/* if (typeof require == "undefined") {
	// in browser, load jQuery JS
	// import jQuery as $ from "../node_modules/jquery/dist/jquery.min.js"
	// see https://stackoverflow.com/a/1140438/8365799
	// currently crashes in jQuery in Firefox
	var script = document.createElement("script")
	script.src = "../node_modules/jquery/dist/jquery.js"
	script.type = "text/javascript"
	document.getElementsByTagName("head")[0].appendChild(script)
} else {
	let $ = require('jquery')
} */

// define a function and call it at the same time
// allows returning
;(function() {
	// debugger
	
	if (typeof require == "undefined") {
		// load dummy list for CSS testing
		let tracks = ["A", "B", "C", "D", "E"]
		let availableTracksContainer = document.getElementById("playlist-panel-full")
		let newHTML = document.createElement("table")
		for (var i = 0; i < tracks.length; i++) {
			let track = tracks[i]
			let row = document.createElement("tr")
			let col0 = document.createElement("td")
			let col1 = document.createElement("td")
			
			col0.className = "table-track-number"
			col1.className = "table-track-name"
			
			/* let log = Math.floor(Math.log10(i+1))
			var zeros = ""
			if (log < 2) {
				zeros = "0".repeat(2 - log)
			}
			col0.innerHTML = `${zeros}${i+1}` */
			col0.innerHTML = i+1
			col1.innerHTML = track
			
			row.draggable = true
			row.ondragstart = function(event) {
				event.dataTransfer.setData("application/editc-itunes-track", JSON.stringify({
					"url": "",
					"title": track,
					"trackNumber": i+1
				}))
			}
			
			row.appendChild(col0)
			row.appendChild(col1)
			newHTML.appendChild(row)
			// debugger
		}
		availableTracksContainer.appendChild(newHTML)

		return
	}
	
	let $ = require('jquery')
	
	$.getJSON('test-data/dummy-playlist.json', function(json) {
		// debugger
		
		// let tracks = JSON.parse(rawJSON.responseText)
		let tracks = json.tracks
		
		let availableTracksContainer = document.getElementById("playlist-panel-full")
		let newHTML = document.createElement("table")
		for (var i = 0; i < tracks.length; i++) {
			let track = tracks[i]
			let row = document.createElement("tr")
			let col0 = document.createElement("td")
			let col1 = document.createElement("td")
			
			col0.className = "table-track-number"
			col1.className = "table-track-name"
			
			/* let log = Math.floor(Math.log10(i+1))
			var zeros = ""
			if (log < 2) {
				zeros = "0".repeat(2 - log)
			}
			col0.innerHTML = `${zeros}${i+1}` */
			col0.innerHTML = i+1
			col1.innerHTML = track
			
			row.draggable = true
			row.ondragstart = function(event) {
				event.dataTransfer.setData("application/editc-itunes-track", JSON.stringify({
					"url": "",
					"title": track,
					"trackNumber": i+1
				}))
			}
			
			row.appendChild(col0)
			row.appendChild(col1)
			newHTML.appendChild(row)
			// debugger
		}
		availableTracksContainer.appendChild(newHTML)
	})
})()

function objectOrParentOfClass(obj, classname) {
	var node = obj
	while (node != null) {
		// console.log("\tlooking at " + obj.className)
		if (node.classList != null && node.classList.contains(classname)) {
			// console.log("found parent: " + node.className)
			return node // we're done!
		}
		node = node.parentElement // will be null if no parent
	}
	// console.log("couldn't find parent for node: " + obj)
	return null // couldn't find anything
}

// set up dragging
// see https://developer.mozilla.org/en-US/docs/Web/Events/dragstart#JavaScript_Content

var currentDraggedTrack
var _lastDragEntered

// set up dragleave event listener on all playlist views to reset their highlight
let playlistViews = document.querySelectorAll(".playlist-view")
for (var i = 0; i < playlistViews.length; i++) {
	let playlistView = playlistViews[i]
	playlistView.addEventListener("dragleave", function(event) {
		console.log("Drag left <" + event.target.nodeName + "> (class: " + event.target.className + ")")
		console.log("[drag last entered <" + _lastDragEntered.nodeName + "> class: " + _lastDragEntered.className + "]")
		if (!playlistView.contains(_lastDragEntered) && event.target == playlistView || !playlistView.contains(event.target)) { // make sure it's not a child element
			console.log("Dragged outside, unhighlighting.")
			playlistView.style = ""
		} else {
			console.log("Dragged over child!")
		}
	}, false)
}

function unhighlightAllPlaylistViews() {
	// unhighlight all playlist views
	let playlistViews = document.querySelectorAll(".playlist-view")
	for (var i = 0; i < playlistViews.length; i++) {
		let playlistView = playlistViews[i]
		playlistView.style = ""
	}
}

// events for draggable items
document.addEventListener("drag", function(event) {
	
}, false) // false: event capturing instead of bubbling (reverse responder chain)
document.addEventListener("drag", function(event) {
	currentDraggedTrack = event.target
	event.target.style.opacity = 0.5 // make half transparent
}, false)
document.addEventListener("dragend", function(event) {
	event.target.style.opacity = "" // reset opacity
	unhighlightAllPlaylistViews()
}, false)

// events for drop targets
document.addEventListener("dragover", function(event) {
	// prevent default to allow drop
	event.preventDefault()
}, false)
document.addEventListener("dragenter", function(event) {
	// highlight drop target
	_lastDragEntered = event.target
	console.log("Drag entered <" + event.target.nodeName + "> (class: " + event.target.className + ")")
	var playlistView = objectOrParentOfClass(event.target, "playlist-view")
	if (playlistView != null) {
		unhighlightAllPlaylistViews() // reset
		playlistView.style.border = "1px dashed #FF6000"
		playlistView.style.padding = playlistView.style.padding + 1
	}
}, false)
/* document.addEventListener("dragleave", function(event) {
	// unhighlight drop target
	// var playlistView = objectOrParentOfClass(event.target, "playlist-view")
	// if (playlistView != null) {
	if (event.target.classList != null && event.target.classList.contains("playlist-view")) {
		event.target.style.border = ""
	}
}, false) */
document.addEventListener("drop", function(event) {
	// prevent default action (open as link for some elements)
	event.preventDefault()
	// move dragged element to the new table
	let dropTarget = objectOrParentOfClass(event.target, "playlist-view")
	// if (event.target.classList != null && event.target.classList.contains("playlist-view")) {
	if (dropTarget != null) {
		currentDraggedTrack.parentNode.removeChild(currentDraggedTrack)
		dropTarget.appendChild(currentDraggedTrack)
	}
	
	unhighlightAllPlaylistViews()
}, false)
