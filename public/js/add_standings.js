// Get the objects we need to modify
let addPersonForm = document.getElementById('add-standings-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeam = document.getElementById("input-team");
    let inputYear = document.getElementById("input-year");
    let inputWins = document.getElementById("input-wins");
    let inputLosses = document.getElementById("input-losses");
    let inputOt = document.getElementById("input-ot");
    let inputPoints = document.getElementById("input-points");

    // Get the values from the form fields
    let teamValue = inputTeam.value;
    let yearValue = inputYear.value;
    let winsValue = inputWins.value;
    let lossesValue = inputLosses.value;
    let otValue = inputOt.value;
    let pointsValue = inputPoints.value;

    // Put our data we want to send in a javascript object
    let data = {
        team_id: teamValue,
        season_id: yearValue,
        wins: winsValue,
        losses: lossesValue,
        ot: otValue,
        points: pointsValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-standings-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTeam.value = '';
            inputYear.value = '';
            inputWins.value = '';
            inputLosses.value = '';
            inputOt.value = '';
            inputPoints.value = '';
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
    let currentTable = document.getElementById("standings-table");

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
    let winsCell = document.createElement("TD");
    let lossesCell = document.createElement("TD");
    let otCell = document.createElement("TD");
    let pointsCell = document.createElement("TD");
    let deleteCell = document.createElement("TD"); // delete functionality

    // delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteStandings(newRow.id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.standings_id;
    teamCell.innerText = newRow.team_id;
    yearCell.innerText = newRow.season_id;
    winsCell.innerText = newRow.wins;
    lossesCell.innerText = newRow.losses;
    otCell.innerText = newRow.ot;
    pointsCell.innerText = newRow.points;

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(teamCell);
    row.appendChild(yearCell);
    row.appendChild(winsCell);
    row.appendChild(lossesCell);
    row.appendChild(otCell);
    row.appendChild(pointsCell);

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