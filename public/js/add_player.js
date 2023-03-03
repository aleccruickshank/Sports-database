// Get the objects we need to modify
let addPersonForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addPersonForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-fname");
    let inputLastName = document.getElementById("input-lname");
    let inputWeight = document.getElementById("input-weight");
    let inputHeight = document.getElementById("input-height");
    let inputDob = document.getElementById("input-dob");
    let inputPosition = document.getElementById("input-position");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let weightValue = inputWeight.value;
    let heightValue = inputHeight.value;
    let dobValue = inputDob.value;
    let positionValue = inputPosition.value;

    // Put our data we want to send in a javascript object
    let data = {
        player_fname: firstNameValue,
        player_lname: lastNameValue,
        player_weight: weightValue,
        player_height: heightValue,
        player_dob: dobValue,
        player_position: positionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputWeight.value = '';
            inputHeight.value = '';
            inputDob.value = '';
            inputPosition.value = '';
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
    let currentTable = document.getElementById("player-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let weightCell = document.createElement("TD");
    let heightCell = document.createElement("TD");
    let dobCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let deleteCell = document.createElement("TD"); // delete functionality

    // delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePlayer(newRow.id);
    };

    // Fill the cells with correct data
    firstNameCell.innerText = newRow.player_fname;
    lastNameCell.innerText = newRow.player_lname;
    weightCell.innerText = newRow.player_weight;
    heightCell.innerText = newRow.player_height;
    dobCell.innerText = newRow.player_dob;
    positionCell.innerText = newRow.player_position;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(weightCell);
    row.appendChild(heightCell);
    row.appendChild(dobCell);
    row.appendChild(positionCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
}