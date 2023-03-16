// Get the objects we need to modify
let updatePlayerForm = document.getElementById('update-player-stats-form-ajax');

// Modify the objects we need
updatePlayerForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputTeam = document.getElementById("input-team-update");
    let inputYear = document.getElementById("input-year-update");
    let inputPlayer = document.getElementById("input-player-update");
    let inputGoals = document.getElementById("input-goals-update");
    let inputAssists = document.getElementById("input-assists-update");
    let inputPoints = document.getElementById("input-points-update");
    let inputGamesPlayed = document.getElementById("input-games-played-update");

    // Get the values from the form fields
    let idValue = inputID.value;
    let teamValue = inputTeam.value;
    let yearValue = inputYear.value;
    let playerValue = inputPlayer.value;
    let goalsValue = inputGoals.value;
    let assistsValue = inputAssists.value;
    let pointsValue = inputPoints.value;
    let gamesPlayedValue = inputGamesPlayed.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // Put our data we want to send in a javascript object
    let data = {
        stats_id: idValue,
        team_id: teamValue,
        season_id: yearValue,
        player_id: playerValue,
        goals: goalsValue,
        assists: assistsValue,
        points: pointsValue,
        games_played: gamesPlayedValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-stats-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

function updateRow(data, stats_id){
    let parsedData = JSON.parse(data);

    let table = document.getElementById("player-stats-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == stats_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].stats_id;
        }
    }
}