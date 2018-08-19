function clickPlaylist(event) {
	let playlistItem = this
	let playlist = JSON.parse(playlistItem.getAttribute("data-editc-playlist"))
	let title = playlist.title
	
	// debugger
	
	dismissPlaylistBrowser()
	
	// setAvailableTracks(tracks)
	setTracksInContainer(document.getElementById("playlist-panel-exploration"), playlist.exploration)
	setTracksInContainer(document.getElementById("playlist-panel-sc"), playlist.supercruise)
	setTracksInContainer(document.getElementById("playlist-panel-combat"), playlist.combat)
	setTracksInContainer(document.getElementById("playlist-panel-thargoids"), playlist.thargoids)
}

function setupPlaylists() {
	let playlistBrowser = document.getElementById("playlist-browser")
	
	let dummyPlaylists = [
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
		
		row.addEventListener("click", clickPlaylist)
		
		// row.setAttribute("data-editc-playlist-title", playlist.name)
		// row.setAttribute("data-editc-playlist-tracklist", JSON.stringify(playlist.tracks))
		row.setAttribute("data-editc-playlist", JSON.stringify(playlist))
		
		row.appendChild(col0)
		// row.appendChild(col1)
		newHTML.appendChild(row)
	}
	playlistBrowser.appendChild(newHTML)
}