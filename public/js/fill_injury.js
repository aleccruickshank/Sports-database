let fillInjuryForm = document.getElementById('mySelect');

function sendID (id) {
    
    return id
}

fillInjuryForm.addEventListener("change", function (e) {

    e.preventDefault();
    
    let injury_id = e.target.value;

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/fill-injury-ajax?injury_id=" + injury_id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Get data by player_id
            fillInjury(xhttp.response);
            // location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

});

function fillInjury (data) {
    let parsedData = JSON.parse(data);
    
    document.getElementById("input-year-update").value = parsedData[0].season_id;
    document.getElementById("input-player-update").value = parsedData[0].player_id;
    document.getElementById("input-games-missed-update").value = parsedData[0].games_missed;
    document.getElementById("input-injury-update").value = parsedData[0].injury_type;
}