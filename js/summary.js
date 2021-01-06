let score = localStorage.getItem("score");
let finalScoreText = document.getElementById("final-score");

finalScoreText.innerHTML = "FINAL SCORE: " + score;
document.getElementById("score").setAttribute("value", score);

/**
 * Submits a request to the server to insert name and score to database.
 */
function submitName() {
    let submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    let xhttp = new XMLHttpRequest();
    let name = document.getElementById("name").value;
    let score = document.getElementById("score").value;

    if (name.includes("#")) {
        let warning = document.getElementById("warning");
        warning.innerHTML = "Cannot put # in name";
        warning.style.fontSize = "1.5vmax";
        return;
    }

    let url = "omitted" + name + "&score=" + score;
    xhttp.open('GET', url, true);
    xhttp.send();

    xhttp.onreadystatechange = function () {               
        window.location.replace("./leaderboard.html");
    }
}

