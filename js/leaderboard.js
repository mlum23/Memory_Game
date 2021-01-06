let xhttp = new XMLHttpRequest();
let url = "omitted";
let topFiveScores = [];
let nameArray = [];
let scoreArray = [];
let loading = document.getElementById("loading");
let leaderBoardTable = document.getElementById("leader-board-table");

const READY_STATE = 4;

getDataFromServer();

/**
 * Sends a request to the server to get the top 5 scores.
 */
function getDataFromServer() {
    xhttp.open('GET', url, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {   
        console.log("Entering state change html")            
        if (this.readyState == READY_STATE) {
            topFiveScores = JSON.parse(this.response);

            for (let i = 0; i < topFiveScores.length; i++) {
                nameArray.push(topFiveScores[i]["name"]);
                scoreArray.push(topFiveScores[i]["score"]);
            }
            displayCurrentUserInfo();
            hideLoadingMessage();
            populateLeaderBoard();
        }
    }
}

/**
 * Hides the loading leaderboard message.
 */
function hideLoadingMessage() {
    loading.style.display = "none";
}

/**
 * Populates the leaderboard with rank, name and score.
 */
function populateLeaderBoard() {
    for (let i = 1; i <= nameArray.length; i++) {
        let row = document.createElement("TR");
        leaderBoardTable.insertAdjacentElement("beforeend", row);
        let rank = document.createElement("TD");
        insertRow(row, rank, i);

        let name = document.createElement("TD");
        insertRow(row, name, nameArray[i-1]);

        let score = document.createElement("TD");
        insertRow(row, score, scoreArray[i-1]);
    }
}

/**
 * 
 * @param {Element} table A TR element.
 * @param {Element} element A TD element.
 * @param {int/string} value The rank, name, or score.
 */
function insertRow(table, element, value) {
    element.innerHTML = value;
    table.insertAdjacentElement("beforeend", element)
}

/**
 * Displays the current user's score.
 */
function displayCurrentUserInfo() {
    const CURRENT_USER_SCORE = localStorage.getItem("score");
    let text = "YOUR SCORE: " + CURRENT_USER_SCORE;
    let userScore = document.getElementById("user-score");
    userScore.innerHTML = text;
}

