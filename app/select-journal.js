let { dialog } = require("electron").remote
console.log("Dialog module:", dialog)

function setupSelectJournalsButton() {
	let selectJournalsButton = document.getElementById("select-journals-button")
	selectJournalsButton.addEventListener("click", (event) => {
		dialog.showOpenDialog({
			title: "Select Journal Path",
			properties: [
				"openDirectory",
				"showHiddenFiles"
			]
		}, function(journalFolder) {
			console.log("Saving journal folder:", journalFolder[0])
			localStorage.setItem("JournalPath", journalFolder[0])
		})
	})
}

setupSelectJournalsButton()
