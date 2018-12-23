var currentCategory = ""
let playedSongs = {} // for rewinding
let queuedSongs = {}
let currentSongs = {}

// set up player
// import MediaPlayer from "node_modules/mediaplayer/media-player.cjs.js";
let MediaPlayer = require("mediaplayer")

/* let player = MediaPlayer(null, {
	prefix: "media",
	"lang": {
		play: "play",
		pause: "pause",
		lang: {
			play: 'play',
			pause: 'pause',
			mute: 'mute',
			unmute: 'unmute',
			volume: 'volume',
			currentTime: 'current time',
			remainingTime: 'remaining time',
			enterFullscreen: 'enter fullscreen',
			leaveFullscreen: 'leave fullscreen',
			download: 'download'
		},
		svgs: {
			play: '#symbol-play',
			pause: '#symbol-pause',
			mute: '#symbol-mute',
			unmute: '#symbol-unmute',
			volume: '#symbol-volume',
			currentTime: '#symbol-currentTime',
			remainingTime: '#symbol-remainingTime',
			enterFullscreen: '#symbol-enterFullscreen',
			leaveFullscreen: '#symbol-leaveFullscreen',
			download: '#symbol-download'
		},
		timeDir: 'ltr',
		volumeDir: 'ltr'
	}
}) */
let player = document.getElementById("main-player")
let controls = new MediaPlayer(player, {
	svgs: {
		play: '#symbol-play',
		pause: '#symbol-pause',
		mute: '#symbol-mute',
		unmute: '#symbol-unmute',
		volume: '#symbol-volume',
		currentTime: '#symbol-currentTime',
		remainingTime: '#symbol-remainingTime',
		enterFullscreen: '#symbol-enterFullscreen',
		leaveFullscreen: '#symbol-leaveFullscreen',
		download: '#symbol-download'
	}
})
player.insertAdjacentElement("afterend", controls)

function playCategory(category, index = null) {
	// let player = document.getElementById("main-player")
	/* if (!player.paused) {
		player.pause()
	} */
	if (playedSongs[currentCategory] == undefined) {
		console.log("Setting up played songs list for "+currentCategory)
		playedSongs[currentCategory] = []
	}
	if (queuedSongs[currentCategory] == undefined) {
		queuedSongs[currentCategory] = []
	}
	if (currentSongs[currentCategory] == undefined) {
		currentSongs[currentCategory] = []
	}
	currentSongs[currentCategory]["pos"] = player.currentTime
	console.log("Old category: " + currentCategory)
	console.log("Played: " + playedSongs[currentCategory])
	console.log("Current: " + currentSongs[currentCategory])
	console.log("Queued: " + queuedSongs[currentCategory])
	// rewind to store current song
	// prevSong(forcePrev=true)
	currentCategory = category
	// set up queues for new category
	if (playedSongs[currentCategory] == undefined) {
		console.log("Setting up played songs list for "+currentCategory)
		playedSongs[currentCategory] = []
	}
	if (queuedSongs[currentCategory] == undefined) {
		queuedSongs[currentCategory] = []
	}
	// playedSongs = []
	// queuedSongs = []
	var tracks = []
	if (category == "") {
		return
	}
	console.log("New category: " + category)
	console.log("Played: " + playedSongs[currentCategory])
	console.log("Current: " + currentSongs[currentCategory])
	console.log("Queued: " + queuedSongs[currentCategory])
	if (category != "Pause") {
		// very similar to saveNewPlaylist() in playlist-browser.js
		var table = document.getElementById("playlist-panel-" + category.toLowerCase()).querySelector("table")
		if (table != null) {
			console.log(category + " table rows: " + JSON.stringify(table.rows))
			// debugger
			for (var i = 0; i < table.rows.length; i++) {
				let row = table.rows[i]
				let data = row.getAttribute("data-editc-track-info")
				// console.log(category + " track data: " + data)
				tracks.push(JSON.parse(data))
				// debugger
			}
		}
	}

	player.setAttribute("data-editc-current-playlist", JSON.stringify(tracks))
	if (tracks.length == 0) {
		player.onended = null
		player.pause()
	} else {
		player.onended = function() {
			nextSong()
		}
		// pick a song to play
		// player.src = tracks[0].path
		/* if (index == null) {
			index = Math.floor(Math.random() * tracks.length)
			console.log("Picking "+category+" song "+index)
		}
		// playedSongs.push(index)
		player.src = tracks[index].path
		player.play() */
		if (index == null) {
			if (currentSongs[currentCategory] != undefined) {
				nextSong(indexOverride=currentSongs[currentCategory]["track"], posOverride=currentSongs[currentCategory]["pos"])
			} else {
				nextSong()
			}
		} else {
			nextSong(indexOverride=index)
		}
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
function nextSong(indexOverride=null, posOverride=0) {
	console.log("Playing next song")
	let player = document.getElementById("main-player")
	let tracks = JSON.parse(player.getAttribute("data-editc-current-playlist"))
	let currentSrc = player.src
	// debugger
	// find the index of the old track
	let indexOfSrc = getIndexOfSrc(currentSrc, tracks)
	if (indexOfSrc == null) {
		indexOfSrc = -1 // guaranteed not to be in the track list
	}
	/* if (indexOfSrc+1 < tracks.length) { // there's another song after this one
		player.src = tracks[indexOfSrc+1].path
		player.play()
	} */
	// pick a new track, make sure it's different from the old track
	var index = indexOfSrc
	if (indexOverride != null && indexOverride != undefined) {
		console.log("Index override: "+indexOverride)
		index = indexOverride
	} else {
		if (queuedSongs[currentCategory] != undefined &&
				queuedSongs[currentCategory].length > 0) {
			// go to the next queued song
			console.log("Next song: found queued song - list is "+queuedSongs)
			index = queuedSongs[currentCategory].pop()
		} else if (index == -1 || tracks.length > 1) {
			console.log("Next song: finding another song")
			while (index == indexOfSrc) {
				index = Math.floor(Math.random() * tracks.length)
			}
		}
	}
	console.log("Picking song "+index)
	if (playedSongs[currentCategory] == undefined) {
		playedSongs[currentCategory] = []
	}
	if (indexOfSrc != -1) {
		playedSongs[currentCategory].push(indexOfSrc)
	}
	console.log("Played songs list now: "+playedSongs[currentCategory])
	console.log("Setting "+index+" as current for "+currentCategory)
	currentSongs[currentCategory] = []
	currentSongs[currentCategory]["track"] = index
	currentSongs[currentCategory]["pos"] = player.currentTime
	player.src = tracks[index].path
	player.currentTime = posOverride
	player.play()
}
function prevSong(forcePrev = false) {
	let player = document.getElementById("main-player")
	if (forcePrev || player.currentTime < 2) { // if at beginning, go to previous track
		let tracks = JSON.parse(player.getAttribute("data-editc-current-playlist"))
		if (playedSongs[currentCategory].length > 0) { // not the first song
			let index = playedSongs[currentCategory].pop()
			let currentIndex = getIndexOfSrc(player.src, tracks)
			console.log("Adding "+currentIndex+" to queued songs")
			if (queuedSongs[currentCategory] == undefined) {
				queuedSongs[currentCategory] = []
			}
			queuedSongs[currentCategory].push(currentIndex) // to be able to go forward in the list
			console.log("played songs now: "+playedSongs[currentCategory])
			console.log("queued songs now: "+queuedSongs[currentCategory])
			currentSongs[currentCategory] = []
			currentSongs[currentCategory]["track"] = index
			currentSongs[currentCategory]["pos"] = player.currentTime
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
