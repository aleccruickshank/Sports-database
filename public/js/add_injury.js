// Get the objects we need to modify
let addPersonForm = document.getElementById('add-injury-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputYear = document.getElementById("input-year");
    let inputPlayer = document.getElementById("input-player");
    let inputGamesMissed = document.getElementById("input-games-missed");
    let inputInjury = document.getElementById("input-injury");

    // Get the values from the form fields
    let yearValue = inputYear.value;
    let playerValue = inputPlayer.value;
    let gamesmissedValue = inputGamesMissed.value;
    let injuryValue = inputInjury.value;

    // Put our data we want to send in a javascript object
    let data = {
        season_id: yearValue,
        player_id: playerValue,
        games_missed: gamesmissedValue,
        injury_type: injuryValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-injury-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputYear.value = '';
            inputPlayer.value = '';
            inputGamesMissed.value = '';
            inputInjury.value = '';
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
    let currentTable = document.getElementById("injuries-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let yearCell = document.createElement("TD");
    let playerCell = document.createElement("TD");
    let gamesMissedCell = document.createElement("TD");
    let injuryTypeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD"); // delete functionality

    // delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteInjury(newRow.id);
    };

    // Fill the cells with correct data
    idCell.innerText = newRow.injury_id;
    yearCell.innerText = newRow.season_id;
    playerCell.innerText = newRow.player_id;
    gamesMissedCell.innerText = newRow.games_missed;
    injuryTypeCell.innerText = newRow.injury_type;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(yearCell);
    row.appendChild(playerCell);
    row.appendChild(gamesMissedCell);
    row.appendChild(injuryTypeCell);

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