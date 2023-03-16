let fillPlayerStatsForm = document.getElementById('mySelect');

function sendID (id) {
    
    return id
}

fillPlayerStatsForm.addEventListener("change", function (e) {

    e.preventDefault();
    
    let stats_id = e.target.value;
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/fill-player-stats-ajax?stats_id=" + stats_id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Get data by stats_id
            fillPlayerStats(xhttp.response);
            // location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

});

function fillPlayerStats (data) {
    let parsedData = JSON.parse(data);
    
    document.getElementById("input-team-update").value = parsedData[0].team_id;
    document.getElementById("input-year-update").value = parsedData[0].season_id;
    document.getElementById("input-player-update").value = parsedData[0].player_id;
    document.getElementById("input-goals-update").value = parsedData[0].goals;
    document.getElementById("input-assists-update").value = parsedData[0].assists;
    document.getElementById("input-points-update").value = parsedData[0].points;
    document.getElementById("input-games-played-update").value = parsedData[0].games_played;
}




