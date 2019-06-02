var fs = require("fs")
var path = require("path")
var chokidar = require("chokidar")

var watching = false

// path.normalize() and path.join() to correctly handle Windows paths
var journalDir = path.normalize(path.join(require("os").homedir(), "Saved Games/Frontier Developments/Elite Dangerous"))

fs.readFile(path.join(journalDir, "Status.json"), "utf8", function(error, data) {
	if (error) {
		// throw(error)
		console.log(error)
		// tru again with fake journal
		journalDir = "/tmp/ed-fake-journal.log"
		fs.readFile(journalDir, "utf8", function(error, data) {
			if (error) {
				// throw(error)
				console.log(error)
				return
			}
			console.log("Fake journal is accessible.", data)
		})
	} else {
		console.log("Journal is accessible.", data)
	}

	console.log("Watching " + journalDir)

	var watcher = chokidar.watch(journalDir, {
		ignored: /(^|[\/\\])\../,
	})

	watcher.on("ready", function() {
		console.log("Watcher is ready: " + JSON.stringify(watcher.getWatched()))
		watching = true
	})
	watcher.on("error", function(error) {
		console.log("Watcher error!", error)
	})
	watcher.on("raw", function(event, path, details) {
		// console.log("Raw event info:", event, path, details)
	})

	watcher.on("add", function(addedPath) {
		updateJournal(addedPath)
	})
	watcher.on("change", function(changedPath) {
		updateJournal(changedPath)
	})
	
	var currentMusicEvent = null
	
	function updateJournal(path) {
		if (!watching) {
			return // chokidar spits out lots of update events before it's ready
		}
		// console.log("Received journal data in " + path)
		fs.readFile(path, "utf8", function(error, data) {
			if (error) {
				throw(error)
			}
			// console.log("Received data:", data)
			var events = data.split("\n")
			// remove blank lines
			events = events.filter(line => line != undefined && line != null && line != "")
			// only last several lines to save time
			events = events.slice(events.length - 5)
			// console.log("Event array length:", events.length)
			// console.log("Events:", events)
			for (var i = 0; i < events.length; i++) {
				if (i > 10000) {
					break
				}
				let event = events[i]
				// console.log("Event: " + event)
				try {
					event = JSON.parse(event)
				} catch (error) {
					// ignore malformed events
					console.log("Malformed event: " + events[i])
				}
				if (event.event == "Music") {
					// console.log("Music event!", event)
					
					// make sure it's not coming in out of order
					
					if (currentMusicEvent == null) { // no current music event
						currentMusicEvent = event
					} else {
						date1 = new Date(currentMusicEvent.timestamp)
						date2 = new Date(event.timestamp)
						if (date2 >= date1) { // this one is newer
							currentMusicEvent = event
						} else {
							console.log("New event out of order!", event)
						}
					}
					if (currentMusicEvent == event) {
						console.log("Changed music!", currentMusicEvent)
						
						changeSong()
					}
				} else if (event.event == "UnderAttack") {
					// change to combat music
					currentMusicEvent = {
						"MusicTrack": "Combat"
					}
					changeSong()
				}
			}
		})
	}
	
	function changeSong() {
		let event = currentMusicEvent
		var category = null
		if (event.MusicTrack.startsWith("Combat") || event.MusicTrack.startsWith("Interdiction")) {
			category = "Combat" // all types of combat, including Thargoid combat (Combat_Unknown)
		} else if (event.MusicTrack.startsWith("Unknown") || event.MusicTrack.endsWith("Unknown")) {
			category = "Thargoids" // Thargoids!
		} else if (event.MusicTrack == "Exploration") {
			category = "Exploration"
		} else if (event.MusicTrack == "Supercruise" || event.MusicTrack == "Starport") {
			category = "Supercruise" // Frameshift and Starports
		} else if (event.MusicTrack == "NoTrack") {
			// always pause on NoTrack, since we have resume now
			category = "Pause"
			// do nothing, NoTrack comes during hyperspace jumps
			// except if previously docking or at the main menu
			/* if (currentCategory.toLowerCase() == "Docking".toLowerCase() ||
			currentCategory.toLowerCase() == "Menu".toLowerCase()) {
				category = "Pause"
			} else {
				return
			} */
		} else if (event.MusicTrack == "MainMenu") {
			category = "Menu"
		} else if (event.MusicTrack == "DockingComputer") {
			category = "Docking"
		} else if (event.MusicTrack.endsWith("Map")) {
			// it's a map, pause it
			// category = "Pause"
			return // don't change the music
		} else if (event.MusicTrack == "GalacticPowers") {
			return // don't change the music
		} else if (event.MusicTrack.startsWith("Guardian")) {
			category = "Exploration"
		} else {
			category = "Supercruise" // catch-all relaxing music
		}
		console.log("New music category: " + category)
		if (category.toLowerCase() != currentCategory.toLowerCase()) {
			playCategory(category)
		}
	}
})

// make clicking on headers change the category
{ 
	let categories = ["Exploration", "Supercruise", "Combat", "Thargoids", "Menu", "Docking"]
	for (var i = 0; i < categories.length; i++) {
		let category = categories[i]
		// console.log(category)
		let playlistPanel = document.getElementById("playlist-panel-" + category.toLowerCase())
		let container = playlistPanel.parentElement
		let label = container.querySelector(".playlist-view-label")
		label.setAttribute("editc-category-name", category.toLowerCase())
		label.addEventListener("click", function() {
			let c = this.getAttribute("editc-category-name")
			playCategory(c)
		}, false)
	}
}
