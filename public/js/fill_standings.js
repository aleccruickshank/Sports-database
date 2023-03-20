let fillStandingsForm = document.getElementById('mySelect');

function sendID (id) {
    
    return id
}

fillStandingsForm.addEventListener("change", function (e) {

    e.preventDefault();
    
    let standings_id = e.target.value;
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/fill-standings-ajax?standings_id=" + standings_id, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            // Get data by stats_id
            fillStandings(xhttp.response);
            // location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

});

function fillStandings (data) {
    let parsedData = JSON.parse(data);
    
    document.getElementById("input-team-update").value = parsedData[0].team_id;
    document.getElementById("input-year-update").value = parsedData[0].season_id;
    document.getElementById("input-wins-update").value = parsedData[0].wins;
    document.getElementById("input-losses-update").value = parsedData[0].losses;
    document.getElementById("input-ot-update").value = parsedData[0].ot;
    document.getElementById("input-points-update").value = parsedData[0].points;
}
