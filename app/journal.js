var fs = require("fs")
var chokidar = require("chokidar")

var watching = false

// let journalDir = "/mnt/c/Users/redacted/Saved Games/Frontier Developments/Elite Dangerous/"
let journalDir = "C:\\Users\\redacted\\Saved Games\\Frontier Developments\\Elite Dangerous"

fs.readFile(journalDir + "\\Status.json", "utf8", function(error, data) {
	if (error) {
		throw(error)
	}
	console.log("Journal is accessible.", data)
})

var watcher = chokidar.watch(journalDir, {
	ignored: /(^|[\/\\])\../,
})

watcher.on("ready", function() {
	console.log("Watcher is ready.")
	watching = true
})
watcher.on("error", function(error) {
	console.log("Watcher error!", error)
})
watcher.on("raw", function(event, path, details) {
	console.log("Raw event info:", event, path, details)
})

watcher.on("add", function(addedPath) {
	updateJournal(addedPath)
})
watcher.on("change", function(changedPath) {
	updateJournal(changedPath)
})

function updateJournal(path) {
	if (!watching) {
		return // chokidar spits out lots of update events before it's ready
	}
	console.log("Received journal data in " + path)
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
				console.log("Music event!", event)
			}
		}
	})
}
