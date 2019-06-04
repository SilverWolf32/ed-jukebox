function restoreLastPlaylist() {
	let restoreString = localStorage.getItem("restorePlaylist")
	let playlist = JSON.parse(restoreString)
	if (playlist == null) {
		return
	}
	
	console.log("Loading restore playlist: " + restoreString)
	
	// MARK: PLAYLIST LOAD
	setTracksInContainer(document.getElementById("playlist-panel-exploration"), playlist.exploration)
	setTracksInContainer(document.getElementById("playlist-panel-supercruise"), playlist.supercruise)
	setTracksInContainer(document.getElementById("playlist-panel-combat"), playlist.combat)
	setTracksInContainer(document.getElementById("playlist-panel-thargoids"), playlist.thargoids)
	setTracksInContainer(document.getElementById("playlist-panel-menu"), playlist.menu)
	setTracksInContainer(document.getElementById("playlist-panel-docking"), playlist.docking)
}
function saveRestorePlaylist(playlist) {
	let restorePlaylistData = JSON.stringify(playlist)
	console.log("Saving restore playlist: " + restorePlaylistData)
	localStorage.setItem("restorePlaylist", restorePlaylistData)
}

console.log("Starting restore")
restoreLastPlaylist()
