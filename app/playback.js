function playCategory(category) {
	var tracks = []
	if (category != "Pause") {
		// very similar to saveNewPlaylist() in playlist-browser.js
		var table = document.getElementById("playlist-panel-" + category.toLowerCase()).querySelector("table")
		if (table != null) {
			console.log(category + " table rows: " + JSON.stringify(table.rows))
			// debugger
			for (var i = 0; i < table.rows.length; i++) {
				let row = table.rows[i]
				let data = row.getAttribute("data-editc-track-info")
				console.log(category + " track data: " + data)
				tracks.push(JSON.parse(data))
				// debugger
			}
		}
	}
	
	let player = document.getElementById("main-player")
	player.setAttribute("data-editc-current-playlist", JSON.stringify(tracks))
	if (tracks.length == 0) {
		player.onended = null
		player.pause()
	} else {
		player.onended = nextSong
		// pick a song to play
		// player.src = tracks[0].path
		let index = Math.floor(Math.random() * tracks.length)
		console.log("Picking "+category+" song "+index)
		player.src = tracks[index].path
		player.play()
	}
}

function nextSong() {
	console.log("Playing next song")
	let player = document.getElementById("main-player")
	let tracks = JSON.parse(player.getAttribute("data-editc-current-playlist"))
	let currentSrc = player.src
	// debugger
	// find the index of the old track
	var indexOfSrc = -1
	for (var i = 0; i < tracks.length; i++) {
		// src automatically got converted to a URL, so a straight comparison won't work
		let trackPath = tracks[i].path
		let trackURL = new URL("file:///" + trackPath).href
		if (currentSrc == trackURL) {
			console.log("Was playing track " + i)
			indexOfSrc = i
			break
		}
	}
	if (indexOfSrc != -1) { // actually found a source
		/* if (indexOfSrc+1 < tracks.length) { // there's another song after this one
			player.src = tracks[indexOfSrc+1].path
			player.play()
		} */
		// pick a new track, make sure it's different from the old track
		var index = indexOfSrc
		while (index == indexOfSrc) {
			index = Math.floor(Math.random() * tracks.length)
		}
		console.log("Picking "+category+" song "+index)
		player.src = tracks[indexOfSrc+1].path
		player.play()
	}
}

playCategory("Menu")