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

function createTrackRow(track) {
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
	col0.textContent = `${zeros}${i+1}` */
	col0.textContent = i+1
	col1.textContent = track.title
	
	row.draggable = true
	row.addEventListener("dragstart", rowDragStart);
	
	row.setAttribute("data-editc-track-info", JSON.stringify(track))
	
	row.appendChild(col0)
	row.appendChild(col1)
	
	// set up reordering
	row.addEventListener("dragenter", rowDragEnter)
	// row.addEventListener("dragleave", rowDragLeave)
	
	return row
}

function setTracksInContainer(container, tracks) {
	// remove everything
	while (container.hasChildNodes()) {
		container.removeChild(container.firstChild)
	}
	
	let newHTML = document.createElement("table")
	for (var i = 0; i < tracks.length; i++) {
		let track = tracks[i]
		let row = createTrackRow(track)
		
		newHTML.appendChild(row)
		// debugger
	}
	container.appendChild(newHTML)
}

// define a function and call it at the same time
// allows returning
;(function() {
	// debugger
	
	/* if (typeof require == "undefined") {
		// load dummy list for CSS testing
		let tracks = ["A", "B", "C", "D", "E"]
		setAvailableTracks(tracks)

		return
	} */
	
	let $ = require('jquery')
	
	$.getJSON('test-data/dummy-playlist.json', function(json) {
		// debugger
		
		// let tracks = JSON.parse(rawJSON.responseText)
		let tracks = json.tracks
		
		setTracksInContainer(document.getElementById("playlist-panel-full"), tracks)
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
function objectOrParentOfType(obj, typeName) {
	var node = obj
	while (node != null) {
		// console.log("\tlooking at " + obj.className)
		if (node.nodeName.toLowerCase() == typeName.toLowerCase()) { // case insensitive
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

function rowDragStart(event) {
	event.dataTransfer.setData("application/editc-itunes-track", JSON.stringify({
		"path": "",
		"title": this.children[1].textContent,
		"trackNumber": i+1
	}))
}
function rowDragEnter() {
	// console.log("Entered row: " + JSON.parse(this.getAttribute("data-editc-track-info")).title)
	currentHighlightedDropTrack = this
}
/* function rowDragLeave(event) {
	let prospectiveRow = objectOrParentOfType(event.target, "tr")
	if (prospectiveRow == this) {
		console.log("Left child of row: " + JSON.parse(this.getAttribute("data-editc-track-info")).title)
		return // still in the row, cancel
	}
	console.log("Left row: " + JSON.parse(this.getAttribute("data-editc-track-info")).title)
	console.log("[event target: " + event.target.nodeName + "]")
	console.log("[prospective parent row: " + prospectiveRow + "]")
	this.style.borderTop = ""
} */

var currentDraggedTrack
var _lastDragEntered
var currentHighlightedDropTrack

// set up dragleave event listener on all playlist views to reset their highlight
let playlistViews = document.querySelectorAll(".playlist-view")
for (var i = 0; i < playlistViews.length; i++) {
	let playlistView = playlistViews[i]
	playlistView.addEventListener("dragleave", function(event) {
		// console.log("Drag left <" + event.target.nodeName + "> (class: " + event.target.className + ")")
		// console.log("[drag last entered <" + _lastDragEntered.nodeName + "> class: " + _lastDragEntered.className + "]")
		if (!playlistView.contains(_lastDragEntered) && event.target == playlistView || !playlistView.contains(event.target)) { // make sure it's not a child element
			// console.log("Dragged outside, unhighlighting.")
			playlistView.style = ""
		} else {
			// console.log("Dragged over child!")
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
	
	// unhighlight all end drop targets
	let dropTargets = document.querySelectorAll(".playlist-add-drop-target")
	for (var i = 0; i < dropTargets.length; i++) {
		let dropTarget = dropTargets[i]
		// dropTarget.style = ""
		dropTarget.classList.remove("playlist-add-drop-target-hover")
	}
}
function unhighlightAllTrackRows() {
	// unhighlight all playlist views
	let rows = document.querySelectorAll(".playlist-view tr")
	for (var i = 0; i < rows.length; i++) {
		let row = rows[i]
		// maintain opacity
		let opacity = row.style.opacity
		row.style = ""
		row.style.opacity = opacity
	}
}
function showAllAddDropTargets() {
	let dropTargets = document.querySelectorAll(".playlist-add-drop-target")
	for (var i = 0; i < dropTargets.length; i++) {
		let dropTarget = dropTargets[i]
		// reset JS-givens style to show it
		dropTarget.style = ""
	}
}
function hideAllAddDropTargets() {
	let dropTargets = document.querySelectorAll(".playlist-add-drop-target")
	for (var i = 0; i < dropTargets.length; i++) {
		let dropTarget = dropTargets[i]
		// move it down
		// dropTarget.style.top = "32px"
		dropTarget.style.height = "0px" // to not take up space
		dropTarget.style.padding = "0px"
		dropTarget.style.visibility = "hidden"
	}
}

hideAllAddDropTargets()

// events for draggable items
document.addEventListener("drag", function(event) {
	currentDraggedTrack = event.target
	event.target.style.opacity = 0.5 // make half transparent
}, false) // false: event capturing instead of bubbling (reverse responder chain)
document.addEventListener("dragstart", function(event) {
	showAllAddDropTargets()
	
	// set allowed drop effects
	event.dataTransfer.effectAllowed = "copyMove"
	
	if (event.target.nodeName != "tr") {
		return false
	}
}, false)
document.addEventListener("dragend", function(event) {
	hideAllAddDropTargets()
	
	currentDraggedTrack = null
	
	event.target.style.opacity = "" // reset opacity
	unhighlightAllPlaylistViews()
	unhighlightAllTrackRows()
}, false)

// events for drop targets
document.addEventListener("dragover", function(event) {
	// prevent default to allow drop
	event.preventDefault()
	
	let playlistView = objectOrParentOfClass(event.target, "playlist-view")
	// change drag/drop mode cursor indication
	let srcView = objectOrParentOfClass(currentDraggedTrack, "playlist-view")
	if (playlistView != null) {
		// console.log("dragover: hovering playlist view: " + playlistView.id)
	}
	// console.log("dragover: source view of dragged track: " + srcView.id)
	if (playlistView != null && playlistView.id == "playlist-panel-full") {
		// event.dataTransfer.dropEffect = "delete"
	} else if (playlistView != null && srcView != null && (playlistView.id == srcView.id || // dragging to same view
			event.target.parentNode == srcView.parentNode)) {
		event.dataTransfer.dropEffect = "move"
	} else if (playlistView != null || // different playlist view
			objectOrParentOfClass(event.target, "playlist-add-drop-target") != null) { // is an append drop target
		event.dataTransfer.dropEffect = "copy"
	} else {
		event.dataTransfer.dropEffect = "none"
	}
}, false)
document.addEventListener("dragenter", function(event) {
	// highlight drop target
	_lastDragEntered = event.target
	// console.log("Drag entered <" + event.target.nodeName + "> (class: " + event.target.className + ")")
	unhighlightAllPlaylistViews() // reset
	let playlistView = objectOrParentOfClass(event.target, "playlist-view")
	if (playlistView != null) {
		playlistView.style.border = "1px dashed #FF6000"
		playlistView.style.padding = playlistView.style.padding + 1
	}
	
	unhighlightAllTrackRows()
	var row = objectOrParentOfType(event.target, "tr")
	if (row != null && playlistView.id != "playlist-panel-full") { // don't show reorder bar in source list
		row.style.borderTop = "1px solid #FF6000"
	}
	
	let addDropTarget = objectOrParentOfClass(event.target, "playlist-add-drop-target")
	if (addDropTarget != null) {
		addDropTarget.classList.add("playlist-add-drop-target-hover")
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
	var dropTargetView = objectOrParentOfClass(event.target, "playlist-view")
	var appendDropTarget = objectOrParentOfClass(event.target, "playlist-add-drop-target")
	if (appendDropTarget != null) {
		// it's a sibling of the playlist view, not a child
		dropTargetView = appendDropTarget.parentNode.querySelector(".playlist-view")
	}
	// if (event.target.classList != null && event.target.classList.contains("playlist-view")) {
	if (dropTargetView != null) {
		let srcView = objectOrParentOfClass(currentDraggedTrack, "playlist-view")
		// console.log("source view id: " + srcView.id)
		if (srcView != null && srcView.id != "playlist-panel-full") {
			currentDraggedTrack.parentNode.removeChild(currentDraggedTrack)
		}
		if (dropTargetView.id != "playlist-panel-full") { // don't re-add to master list
			var tracks = []
			
			// get file data if it's an external file
			// see https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
			// debugger
			/* if (0) {
				// use DataTransferItemList interface
				var draggedItems = event.dataTransfer.items
				for (var i = 0; i < draggedItems.length; i++) {
					// reject anything that isn't a file
					if (draggedItems[i].kind === "file" && draggedItems[i].type.match(/audio\/* /)) {
						var file = draggedItems[i].getAsFile()
						let newTrack = {
							"title": file.name,
							"path": file.path
						}
						tracks.push(newTrack)
					}
				}
			} else { */
			// use DataTransfer interface
			for (var i = 0; i < event.dataTransfer.files.length; i++) {
				let file = event.dataTransfer.files[i]
				// if (file.type.match(/audio\/*/)) {
				let newTrack = {
					"title": file.name,
					"path": file.path
				}
				tracks.push(newTrack)
				// }
			}
			// }
			
			var dropTargetRow = objectOrParentOfType(event.target, "tr")
			var newRows = []
			if (currentDraggedTrack != null) { // no files, it's a row
				let duplicate = currentDraggedTrack.cloneNode(true)
				duplicate.addEventListener("dragstart", rowDragStart)
				duplicate.addEventListener("dragenter", rowDragEnter)
				// duplicate.addEventListener("dragleave", rowDragLeave)
				duplicate.style = "" // reset
				// dropTarget.appendChild(duplicate)
				newRows.push(duplicate)
			} else {
				// debugger
				for (var i = 0; i < tracks.length; i++) {
					let newRow = createTrackRow(tracks[i])
					newRows.push(newRow)
				}
			}
			var table = dropTargetView.querySelector("table")
			
			if (table == null) { // there is no table
				table = document.createElement("table")
				dropTargetView.appendChild(table)
			}
			
			// table.appendChild(duplicate)
			for (var i = 0; i < newRows.length; i++) {
				console.log("Adding "+newRows[i])
				table.insertBefore(newRows[i], dropTargetRow)
			}
			
			// update track numbers
			for (var i = 0; i < table.rows.length; i++) {
				let row = table.rows[i]
				let col = row.children[0]
				console.log("table row: " + col.textContent + " " + row.children[1].textContent)
				col.textContent = i+1
			}
		}
	}
	
	currentDraggedTrack = null
	unhighlightAllPlaylistViews()
	unhighlightAllTrackRows()
	hideAllAddDropTargets()
}, false)
