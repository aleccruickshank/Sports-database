let fillPlayerForm = document.getElementById('mySelect');
// let updatePlayerForm = document.getElementById('update-player-form-ajax');

function sendID (id) {
    
    return id
}

fillPlayerForm.addEventListener("change", function (e) {

    e.preventDefault();

    let player_id = e.target.value;

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/fill-player-ajax?player_id=" + player_id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    // xhttp.onreadystatechange=(e)=>{
       
    //     console.log(xhttp.responseText)
    //     }

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Get data by player_id
            fillPlayer(xhttp.response);
            // location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

});

function fillPlayer (data) {
    let parsedData = JSON.parse(data);
    
    document.getElementById("input-weight-update").value = parsedData[0].player_weight;
    document.getElementById("input-height-update").value = parsedData[0].player_height;
    document.getElementById("input-dob-update").value = parsedData[0].player_dob;
    document.getElementById("input-position-update").value = parsedData[0].player_position;
}