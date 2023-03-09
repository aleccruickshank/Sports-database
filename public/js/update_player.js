// Get the objects we need to modify
let updatePlayerForm = document.getElementById('update-player-form-ajax');

// Modify the objects we need
updatePlayerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("mySelect");
    let inputWeight = document.getElementById("input-weight-update");
    let inputHeight = document.getElementById("input-height-update");
    let inputDob = document.getElementById("input-dob-update");
    let inputPosition = document.getElementById("input-position-update");

    // Get the values from the form fields
    let idValue = inputID.value;
    let weightValue = inputWeight.value;
    let heightValue = inputHeight.value;
    let dobValue = inputDob.value;
    let positionValue = inputPosition.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    // Put our data we want to send in a javascript object
    let data = {
        player_id: idValue,
        player_weight: weightValue,
        player_height: heightValue,
        player_dob: dobValue,
        player_position: positionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-ajax", true);
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

function updateRow(data, player_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("player-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == player_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].player_id;
       }
    }
}