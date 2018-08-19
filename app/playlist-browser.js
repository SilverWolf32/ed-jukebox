function clickPlaylist(event) {
	let playlist = this
	let title = playlist.getAttribute("data-editc-playlist-title")
	let tracks = JSON.parse(playlist.getAttribute("data-editc-playlist-tracklist"))
	
	// debugger
	
	dismissPlaylistBrowser()
	
	setAvailableTracks(tracks)
}

function setupPlaylists() {
	let playlistBrowser = document.getElementById("playlist-browser")
	
	let dummyPlaylists = [
		{
			"name": "Playlist A",
			"tracks": [
				{
					"title": "ABC",
					"url": null,
				},
				{
					"title": "DEF",
					"url": null,
				},
				{
					"title": "GHI",
					"url": null,
				}
			]
		},
		{
			"name": "Playlist B",
			"tracks": [
				{
					"title": "JKL",
					"url": null,
				},
				{
					"title": "MNO",
					"url": null,
				},
				{
					"title": "PQR",
					"url": null,
				}
			]
		}
	]
	
	let playlists = dummyPlaylists
	
	// remove everything
	while (playlistBrowser.hasChildNodes()) {
		playlistBrowser.removeChild(playlistBrowser.firstChild)
	}
	
	let newHTML = document.createElement("table")
	for (var i = 0; i < playlists.length; i++) {
		let playlist = playlists[i]
		let row = document.createElement("tr")
		let col0 = document.createElement("td")
		// let col1 = document.createElement("td")
		
		col0.className = "playlist-table-name"
		
		col0.textContent = playlist.name
		
		row.draggable = true
		row.ondragstart = rowDragStart
		
		row.addEventListener("click", clickPlaylist)
		
		row.setAttribute("data-editc-playlist-title", playlist.name)
		row.setAttribute("data-editc-playlist-tracklist", JSON.stringify(playlist.tracks))
		
		row.appendChild(col0)
		// row.appendChild(col1)
		newHTML.appendChild(row)
	}
	playlistBrowser.appendChild(newHTML)
}