// ==UserScript==
// @name         AMQ Disable Auto Skip Vote on Incorrect Answers
// @namespace    https://github.com/Onetel2
// @version      0.1
// @description  enables an hotkey function to disable the Auto Skip Vote for incorrect answers
// @description  must have Auto Skip Vote (Replay Phase) ticked under AMQ's general game settings
// @description  [SHIFT] + [CTRL] + C to activate
// @icon         https://www.google.com/s2/favicons?domain=animemusicquiz.com
// @author       Onetel2
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/joske2865/AMQ-Scripts/master/common/amqScriptInfo.js
// ==/UserScript==

//Fully compatible with other scripts that will Auto Skip Vote during Guess Phase (such as AutoThrow or nyamu's Hotkey functions)

function doc_keyUp(event) {
    // Check if the released key is 'C' and if Shift and Alt keys are pressed
    if (event.keyCode == 67 && event.shiftKey && event.altKey) {
        isAutoSkip = !isAutoSkip;
        chatSystemMessage(isAutoSkip ? "Disabled Auto Skip (Replay Phase) for incorrect answers" : "Enabled Auto Skip (Replay Phase) for incorrect answers");
    }
}

function chatSystemMessage(msg) {
    if (!gameChat.isShown()) return;
    gameChat.systemMessage(msg);
}

var isAutoSkip = false;

// Listener for pressing keys
document.addEventListener('keyup', doc_keyUp, false);

// Listener for "answer results" event
let answerResults = new Listener("answer results", function(result) {
    // Check if the player is a spectator
    if (quiz.isSpectator) return;

    // Check if auto-skip is enabled and every player answered incorrectly
    if (isAutoSkip && result.players.every(player => !player.correct)) {
        // Add a timeout function to allow AMQ to attempt to skip the song first
        setTimeout(function () {
            quiz.skipClicked();
        }, 500);
    }
}).bindListener(); // Use bindListener to bind the listener

AMQ_addScriptData({
	name: "Disable Auto Skip Vote for Incorrect Answers",
	author: "Onetel2",
	description: `
		<p>Make sure that Auto Skip Vote (Replay Phase) is ticked in AMQ's general game settings</p>
		<p>The Replay Phase won't be automatically skipped by AMQ's settings if every player answered incorrectly</p>
		<p>[Shift + Alt + C] : Disable Auto Skip for incorrect answers</p>
		<p></p>
	`
});
