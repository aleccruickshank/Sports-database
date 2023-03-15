// Get the objects we need to modify
let addPersonForm = document.getElementById('add-player-stats-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeam = document.getElementById("input-team");
    let inputYear = document.getElementById("input-year");
    let inputPlayer = document.getElementById("input-player");
    let inputGoals = document.getElementById("input-goals");
    let inputAssists = document.getElementById("input-assists");
    let inputPoints = document.getElementById("input-points");
    let inputGamesPlayed = document.getElementById("input-games-played");

    // Get the values from the form fields
    let teamValue = inputTeam.value;
    let yearValue = inputYear.value;
    let playerValue = inputPlayer.value;
    let goalsValue = inputGoals.value;
    let assistsValue = inputAssists.value;
    let pointsValue = inputPoints.value;
    let gamesPlayedValue = inputGamesPlayed.value;

    // Put our data we want to send in a javascript object
    let data = {
        team_id: teamValue,
        season_id: yearValue,
        player_id: playerValue,
        goals: goalsValue,
        assists: assistsValue,
        points: pointsValue,
        games_missed: gamesPlayedValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-stats-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTeam.value = '';
            inputYear.value = '';
            inputPlayer.value = '';
            inputGoals.value = '';
            inputAssists.value = '';
            inputPoints.value = '';
            inputGamesPlayed.value = '';
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("player-stats-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let teamCell = document.createElement("TD");
    let yearCell = document.createElement("TD");
    let playerCell = document.createElement("TD");
    let goalsCell = document.createElement("TD");
    let assistsCell = document.createElement("TD");
    let pointsCell = document.createElement("TD");
    let gamesPlayedCell = document.createElement("TD");
    let deleteCell = document.createElement("TD"); // delete functionality

    // delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePlayerStats(newRow.id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.stats_id;
    teamCell.innerText = newRow.team_id;
    yearCell.innerText = newRow.season_id;
    playerCell.innerText = newRow.player_id;
    goalsCell.innerText = newRow.goals;
    assistsCell.innerText = newRow.assists;
    pointsCell.innerText = newRow.points;
    gamesPlayedCell.innerText = newRow.games_played;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(teamCell);
    row.appendChild(yearCell);
    row.appendChild(playerCell);
    row.appendChild(goalsCell);
    row.appendChild(assistsCell);
    row.appendChild(pointsCell);
    row.appendChild(gamesPlayedCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);


    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' +  newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);

}