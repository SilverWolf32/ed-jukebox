function clickPlaylist(event) {
	let playlistItem = this
	let playlist = JSON.parse(playlistItem.getAttribute("data-editc-playlist"))
	let title = playlist.title
	
	// debugger
	
	dismissPlaylistBrowser()
	
	// setAvailableTracks(tracks)
	setTracksInContainer(document.getElementById("playlist-panel-exploration"), playlist.exploration)
	setTracksInContainer(document.getElementById("playlist-panel-supercruise"), playlist.supercruise)
	setTracksInContainer(document.getElementById("playlist-panel-combat"), playlist.combat)
	setTracksInContainer(document.getElementById("playlist-panel-thargoids"), playlist.thargoids)
	setTracksInContainer(document.getElementById("playlist-panel-menu"), playlist.menu)
	setTracksInContainer(document.getElementById("playlist-panel-docking"), playlist.docking)
	
	// start a song
	playCategory(currentCategory)
}

async function setupPlaylists() {
	let playlistBrowser = document.getElementById("playlist-browser")
	
	/* let dummyPlaylists = [
		{
			"name": "Playlist A",
			"exploration": [
				{
					"title": "ABC",
					"url": null,
				},
				{
					"title": "DEF",
					"url": null,
				}
			],
			"supercruise": [
				{
					"title": "GHI",
					"url": null,
				},
				{
					"title": "JKL",
					"url": null,
				}
			],
			"combat": [
				{
					"title": "MNO",
					"url": null,
				}
			],
			"thargoids": [
				{
					"title": "PQR",
					"url": null,
				}
			]
		}
	] */
	
	// let playlists = dummyPlaylists
	// let savedPlaylists = loadPlaylists()
	// playlists = playlists.concat(loadPlaylists())
	let playlists = loadPlaylists()
	
	// debugger
	
	// remove everything
	while (playlistBrowser.hasChildNodes()) {
		playlistBrowser.removeChild(playlistBrowser.firstChild)
	}
	
	let newTable = document.createElement("table")
	for (var i = 0; i < playlists.length; i++) {
		let playlist = playlists[i]
		let row = document.createElement("tr")
		let col0 = document.createElement("td")
		// let col1 = document.createElement("td")
		
		col0.className = "playlist-table-name"
		
		let p = document.createElement("p")
		p.textContent = playlist.name
		col0.appendChild(p)
		
		row.addEventListener("click", clickPlaylist)
		
		// row.setAttribute("data-editc-playlist-title", playlist.name)
		// row.setAttribute("data-editc-playlist-tracklist", JSON.stringify(playlist.tracks))
		row.setAttribute("data-editc-playlist", JSON.stringify(playlist))
		
		row.appendChild(col0)
		// row.appendChild(col1)
		
		// add slide-out buttons container
		let buttonsContainer = document.createElement("div")
		buttonsContainer.className = "playlist-buttons-slideout"
		
		// add delete button
		let deletePreButton = document.createElement("button")
		let deleteImg = document.createElement("img")
		deleteImg.src = "icons/DeleteButton.svg"
		deleteImg.draggable = false
		deletePreButton.appendChild(deleteImg)
		
		deletePreButton.className = "delete-playlist-button"
		
		deletePreButton.addEventListener("click", function(event) {
			event.preventDefault()
			event.stopPropagation()
			// unhide actual delete button
			let row = this.parentNode.parentNode
			let button = row.querySelector(".delete-playlist-button-full")
			button.style.visibility = "visible"
			button.style.right = 0
			button.style.width = "auto"
		})
		
		let deleteButton = document.createElement("button")
		deleteButton.textContent = "Delete"
		deleteButton.className = "delete-playlist-button-full"
		
		deleteButton.addEventListener("click", function(event) {
			event.preventDefault()
			event.stopPropagation()
			let row = this.parentNode.parentNode
			let playlist = row.getAttribute("data-editc-playlist")
			deletePlaylistWithJSONData(playlist)
			// reload list
			setupPlaylists()
		})
		
		buttonsContainer.appendChild(deletePreButton)
		col0.appendChild(buttonsContainer)
		col0.appendChild(deleteButton)
		
		newTable.appendChild(row)
	}
	
	playlistBrowser.appendChild(newTable)
	
	playlistBrowser.addEventListener("mouseleave", function(event) {
		// hide all delete buttons on mouse leave
		console.log("Received hide delete buttons event: " + this)
		console.log(this.nodeName.toLowerCase())
		console.log("Hiding delete buttons")
		// event.preventDefault()
		event.stopPropagation()
		let buttons = this.querySelectorAll(".delete-playlist-button-full")
		for (i = 0; i < buttons.length; i++) {
			let button = buttons[i]
			button.style = ""
		}
	}, false) // , false: invert responder chain -- top down!
}

// local storage

function loadPlaylists() {
	/* chrome.storage.local.get(["playlists"], function(playlists) {
		return playlists
	}) */
	let playlists = JSON.parse(localStorage.getItem("playlists"))
	if (playlists) {
		return playlists
	} else {
		return []
	}
}
function savePlaylist(playlist) {
	let playlists = JSON.parse(localStorage.getItem("playlists"))
	if (playlists == null) {
		// no prior playlists, this is the first one
		playlists = [playlist]
	} else {
		// append to list
		playlists.push(playlist)
	}
	localStorage.setItem("playlists", JSON.stringify(playlists))
}
function deletePlaylistWithJSONData(playlistData) {
	let playlists = JSON.parse(localStorage.getItem("playlists"))
	if (playlists == null) {
		// no playlists, nothing to do
		return
	}
	console.log("Deleting playlist: " + playlistData)
	for (var i = 0; i < playlists.length; i++) {
		let playlist = playlists[i]
		console.log("Comparing: " + JSON.stringify(playlist))
		if (JSON.stringify(playlist) == playlistData) {
			playlists.splice(i, 1) // remove element
			i--
			break // no need to iterate further
		}
	}
	localStorage.setItem("playlists", JSON.stringify(playlists))
}

// mini save dialog

// see https://stackoverflow.com/a/896774/8365799
function focusMiniSaveNameField(iteration) {
	// console.log("Iteration " + iteration)
	let textField = document.getElementById("new-playlist-name-field")
	textField.focus()
	if (iteration > 10 || document.activeElement == textField) { // stop if focus succeeded
		return
	} else {
		setTimeout("focusMiniSaveNameField(" + (iteration+1) + ")", 100)
	}
}

function showMiniSaveDialog() {
	let dialog = document.getElementById("new-playlist-mini-dialog")
	dialog.style.visibility = "visible"
	dialog.style.opacity = 1.0
	dialog.style.left = "0px" // slide in
	focusMiniSaveNameField(0)
}
function dismissMiniSaveDialog() {
	let dialog = document.getElementById("new-playlist-mini-dialog")
	dialog.style.opacity = 0.0
	dialog.style.visibility = "hidden"
	dialog.style.left = "" // slide out
}

document.getElementById("new-playlist-button").addEventListener("click", showMiniSaveDialog)
// Esc in save dialog cancels
document.getElementById("new-playlist-mini-dialog").addEventListener("keyup", function() {
	if (event.key == "Escape") {
		event.stopPropagation() // stop propagation up the responder chain
		dismissMiniSaveDialog()
	}
})

function saveNewPlaylist() {
	let playlistName = document.getElementById("new-playlist-name-field").value
	
	let playlist = {}
	playlist.name = playlistName
	
	function populate(category) {
		playlist[category] = []
		var table = document.getElementById("playlist-panel-" + category).querySelector("table")
		if (table != null) {
			console.log(category + " table rows: " + JSON.stringify(table.rows))
			for (var i = 0; i < table.rows.length; i++) {
				let row = table.rows[i]
				let data = row.getAttribute("data-editc-track-info")
				console.log(category + " track data: " + data)
				playlist[category].push(JSON.parse(data))
				debugger
			}
		}
	}
	
	populate("exploration")
	populate("supercruise")
	populate("combat")
	populate("thargoids")
	populate("menu")
	populate("docking")
	
	console.log("FINISHED PLAYLIST: " + JSON.stringify(playlist))
	
	// append to playlists
	savePlaylist(playlist)
	
	// reload list
	setupPlaylists()
	
	// dismiss mini dialog
	dismissMiniSaveDialog()
}
document.getElementById("new-playlist-save-button").addEventListener("click", saveNewPlaylist)
document.getElementById("new-playlist-name-field").addEventListener("keypress", function() {
	if (event.key == "Enter") {
		event.stopPropagation()
		event.preventDefault()
		saveNewPlaylist()
	}
})
