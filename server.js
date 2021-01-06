let http = require('http');
let url = require('url');
let mysql = require("mysql");
let result;

let con = mysql.createConnection({
    // DB info omitted.
    host: 'omitted',
    user: 'omitted',
    password: 'omitted',
    database: 'omitted',
    port: 'omitted'
});


http.createServer(async function (req, res) {
    let q = url.parse(req.url, true);
    let name = q.query["name"];
    let score = q.query["score"];

    if (q.href.includes("?name")) {
        console.log("Entering summary");
        result = handleSummaryPage(con, name, score) 

    } else if (q.href.includes("?leaderboard")) {
        result = await handleLeaderboardPage(con);
        console.log("printing x inside leaderboard fcn")
        console.log(result);
    }
    res.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
    console.log("printing x before end");
    result = JSON.stringify(result);
    res.end(result);
}).listen(process.env.PORT || 3000);

/**
 * Inserts the user's name and score to the database.
 * @param {mysql.connection} con
 * @param {string} name the user's name.
 * @param {int} score the user's score.
 */
function handleSummaryPage(con, name, score) {
    let sql = "INSERT INTO leaderboard (name, score) VALUES ('" 
                + name + "', " + score + ")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted data into leaderboard table");
        return result;
    });
}

/**
 * Queries the top 5 scores from the database.
 * @param {mysql.connection} con
 */
async function handleLeaderboardPage(con) {
    console.log("Entering leaderboard");
    let sql = "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5";

    // Query implicitly calls con.connect
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) throw err;
            resolve(result);
        });
    })
    
}
