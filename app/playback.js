var currentCategory = ""
let playedSongs = [] // for rewinding
let queuedSongs = []

function playCategory(category, index = null) {
	currentCategory = category
	playedSongs = []
	queuedSongs = []
	var tracks = []
	if (category == "") {
		return
	}
	console.log("New category: " + category)
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
		if (index == null) {
			index = Math.floor(Math.random() * tracks.length)
			console.log("Picking "+category+" song "+index)
		}
		// playedSongs.push(index)
		player.src = tracks[index].path
		player.play()
	}
}

function getIndexOfSrc(currentSrc, tracks) {
	var indexOfSrc = -1
	for (var i = 0; i < tracks.length; i++) {
		// src automatically got converted to a URL, so a straight comparison won't work
		let trackPath = tracks[i].path
		let trackURL = new URL("file:///" + trackPath).href
		if (currentSrc == trackURL) {
			console.log("Currently playing track " + i)
			indexOfSrc = i
			break
		}
	}
	return indexOfSrc
}
function nextSong() {
	console.log("Playing next song")
	let player = document.getElementById("main-player")
	let tracks = JSON.parse(player.getAttribute("data-editc-current-playlist"))
	let currentSrc = player.src
	// debugger
	// find the index of the old track
	let indexOfSrc = getIndexOfSrc(currentSrc, tracks)
	if (indexOfSrc != -1) { // actually found a source
		/* if (indexOfSrc+1 < tracks.length) { // there's another song after this one
			player.src = tracks[indexOfSrc+1].path
			player.play()
		} */
		// pick a new track, make sure it's different from the old track
		var index = indexOfSrc
		if (queuedSongs.length > 0) {
			// go to the next queued song
			console.log("Next song: found queued song - list is "+queuedSongs)
			index = queuedSongs.pop()
		} else if (tracks.length > 1) {
			while (index == indexOfSrc) {
				index = Math.floor(Math.random() * tracks.length)
			}
		}
		console.log("Picking song "+index)
		playedSongs.push(indexOfSrc)
		console.log("Played songs list now: "+playedSongs)
		player.src = tracks[index].path
		player.play()
	}
}
function prevSong() {
	let player = document.getElementById("main-player")
	if (player.currentTime < 2) { // if at beginning, go to previous track
		let tracks = JSON.parse(player.getAttribute("data-editc-current-playlist"))
		if (playedSongs.length > 0) { // not the first song
			let index = playedSongs.pop()
			let currentIndex = getIndexOfSrc(player.src, tracks)
			console.log("Adding "+currentIndex+" to queued songs")
			queuedSongs.push(currentIndex) // to be able to go forward in the list
			console.log("played songs now: "+playedSongs)
			console.log("queued songs now: "+queuedSongs)
			player.src = tracks[index].path
			player.play()
		}
	} else {
		// rewind
		player.currentTime = 0
	}
}

// playCategory("Menu")

// register global shortcut to skip to the next track
// https://electronjs.org/docs/api/global-shortcut

const {remote} = require("electron")
const {globalShortcut} = remote

globalShortcut.unregister("MediaPreviousTrack")
globalShortcut.unregister("MediaPlayPause")
globalShortcut.unregister("MediaNextTrack")

if (!globalShortcut.register("MediaPreviousTrack", function() {
	prevSong()
})) {
	console.log("Global shortcut registration failed!")
}
console.log("Rewind shortcut status: " + globalShortcut.isRegistered("MediaPreviousTrack"))
if (!globalShortcut.register("MediaPlayPause", function() {
	let player = document.getElementById("main-player")
	if (player.paused) {
		player.play()
	} else {
		player.pause()
	}
})) {
	console.log("Global shortcut registration failed!")
}
console.log("Play/Pause shortcut status: " + globalShortcut.isRegistered("MediaPlayPause"))
if (!globalShortcut.register("MediaNextTrack", function() {
	nextSong()
})) {
	console.log("Global shortcut registration failed!")
}
console.log("Skip shortcut status: " + globalShortcut.isRegistered("MediaNextTrack"))
