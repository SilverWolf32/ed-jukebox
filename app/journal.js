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
		ignored: /(^|[\/\\])\../, // ignore dotfiles, see https://github.com/paulmillr/chokidar
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

	watcher.on("add", function watcherAdd(addedPath) {
		updateJournal(addedPath)
	})
	watcher.on("change", function watcherChange(changedPath) {
		updateJournal(changedPath)
	})
	
	var currentMusicEvent = null
	
	async function updateJournal(path, readingOldJournals=false) {
		if (!watching && !readingOldJournals) {
			return // chokidar spits out lots of update events before it's ready
		}
		console.log("Received journal data in " + path)
		let data = fs.readFileSync(path, "utf8")
		
		// console.log("Received data:", data)
		var events = data.split("\n")
		// remove blank lines
		events = events.filter(line => line != undefined && line != null && line != "")
		console.log("Got", events.length, ((events.length === 1) ? "event" : "events"))
		// console.log("Events:", events)
		for (var i = 0; i < events.length; i++) {
			let event = events[i]
			// console.log("Event: " + event)
			try {
				event = JSON.parse(event)
			} catch (error) {
				// ignore malformed events
				console.log("Malformed event: " + events[i])
			}
			
			// console.log(event.timestamp + " " + event.event)
			{
				let eventDate = new Date(event.timestamp)
				let now = new Date()
				if (eventDate.getDate() != now.getDate() // dayof month
					|| eventDate.getMonth() != now.getMonth()
					|| eventDate.getYear() != now.getYear()) {
					// ignore all events that aren't from today
					// continue
				}
			}
			
			if (event.event == "Music") {
				// console.log("Music event", event.timestamp)
				
				// make sure it's not coming in out of order
				
				if (currentMusicEvent == null) { // no current music event
					currentMusicEvent = event
				} else {
					date1 = new Date(currentMusicEvent.timestamp)
					date2 = new Date(event.timestamp)
					if (date2 >= date1) { // this one is newer
						currentMusicEvent = event
						console.log("Got music event:", event)
					} else {
						// console.log("New event out of order!", currentMusicEvent, event)
					}
				}
				if (currentMusicEvent == event) {
					console.log("Changed music!", currentMusicEvent)
					
					changeSong()
				}
			} else if (event.event == "UnderAttack") {
				// console.log("Under attack!", event.timestamp)
				// change to combat music
				let newEvent = {
					"MusicTrack": "Combat",
					"timestamp": event.timestamp
				}
				if (currentMusicEvent == null) { // no current music event
					currentMusicEvent = newEvent
				} else {
					date1 = new Date(currentMusicEvent.timestamp)
					date2 = new Date(event.timestamp)
					if (date2 >= date1) { // this one is newer
						currentMusicEvent = newEvent
						console.log("Got UnderAttack event:", event)
					} else {
						// console.log("New event out of order!", currentMusicEvent, event)
					}
				}
				if (currentMusicEvent == newEvent) {
					console.log("Under attack! Combat music!")
					changeSong()
				}
			} else if (event.event == "Shutdown") {
				// console.log("Shutdown", event.timestamp)
				// autopause when Elite quits
				let newEvent = {
					"MusicTrack": "NoTrack",
					"timestamp": event.timestamp
				}
				if (currentMusicEvent == null) { // no current music event
					currentMusicEvent = newEvent
				} else {
					date1 = new Date(currentMusicEvent.timestamp)
					date2 = new Date(event.timestamp)
					if (date2 >= date1) { // this one is newer
						currentMusicEvent = newEvent
						console.log("Got shutdown event:", event)
					} else {
						// console.log("New event out of order!", currentMusicEvent, event)
					}
				}
				if (currentMusicEvent == newEvent) {
					console.log("Elite shutdown, pausing")
					changeSong()
				}
			}
		}
	}
	
	function changeSong() {
		let event = currentMusicEvent
		console.log("Changing category with event:", event)
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
			playCategory(category.toLowerCase())
		}
	}
	
	async function readOldJournals() {
		disablePlay()
		
		console.log("Reading journal backlog")
		// see https://stackoverflow.com/a/51888262
		let files = fs.readdirSync(journalDir)
		console.log("All files:", files)
		files = files.filter(function(file) {
			// console.log("[" + file + "]")
			result = /Journal.*\.log/.test(file)
			// console.log(result)
			return result
		})
		console.log("Journal files:", files)
		for (let i = 0; i < files.length; i++) {
			let file = files[i]
			console.log("Reading from old journal:", file)
			let fullPath = path.join(journalDir, file)
			await updateJournal(fullPath, true)
		}
		
		play()
		
		enablePlay()
		if (currentCategory != "pause" && currentCategory != "") {
			// debugger
			play()
		}
	}
	
	readOldJournals()
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
