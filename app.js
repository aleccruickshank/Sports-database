/*
    SETUP
*/

// Express
var express = require('express');
var moment = require('moment');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 55234;

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        let query1 = "select * from Players;"; 
        
        db.pool.query(query1, function(error, rows, fields){
            
            for (key in rows) {
                rows[key].player_dob = moment(rows[key].player_dob).format("YYYY-MM-DD");
            }
            
            res.render('index', {data: rows});
            
        })
    });

app.get('/players', function(req, res)
    {
        let query1 = "select * from Players;"; 
        
        db.pool.query(query1, function(error, rows, fields){
            
            for (key in rows) {
                rows[key].player_dob = moment(rows[key].player_dob).format("YYYY-MM-DD");
            }
            
            res.render('players', {data: rows});
            
        })
    });

app.get('/fill-player-ajax', function(req, res)
    {
        let data = req.query;
        let player_id = parseInt(data.player_id)

        // let query1 = "select player_weight, player_height, player_dob, player_position from Players where player_id = ?;"; 
        let query1 = "select * from Players where player_id = ?;"
        
        db.pool.query(query1, [player_id], function(error, rows, fields){
            
            // Format the birth date to YYYY-MM-DD
            
            for (key in rows) {
                rows[key].player_dob = moment(rows[key].player_dob).format("YYYY-MM-DD");
            }

            res.send(rows);
            
        })
    });

app.get('/fill-injury-ajax', function(req, res)
    {
        let data = req.query;
        let injury_id = parseInt(data.injury_id)
       
        let query1 = "select * from Games_Injured where injury_id = ?;"
        
        db.pool.query(query1, [injury_id], function(error, rows, fields){
            

            res.send(rows);
            
        })
    });

app.get('/fill-player-stats-ajax', function(req, res)
    {
        let data = req.query;
        
        let stats_id = parseInt(data.stats_id)
       
        let query1 = "select * from Player_Stats where stats_id = ?;"
        
        db.pool.query(query1, [stats_id], function(error, rows, fields){
            
            res.send(rows);
            
        })
    });

app.get('/fill-standings-ajax', function(req, res)
    {
        let data = req.query;
        
        let standings_id = parseInt(data.standings_id)
       
        let query1 = "select * from Standings where standings_id = ?;"
        
        db.pool.query(query1, [standings_id], function(error, rows, fields){
            
            res.send(rows);
            
        })
    });

app.get('/seasons', function(req, res)
    {
        let query1 = "select * from Seasons;"; 
        
        db.pool.query(query1, function(error, rows, fields){
            
            res.render('seasons', {data: rows});
            
        })

    });  


app.get('/injuries', async (req, res) => {
        
        
        let query1 = "SELECT gi.injury_id, p.player_id, s.season_year, s.season_id, CONCAT(p.player_fname, ' ', p.player_lname) as player_name, gi.injury_type, gi.games_missed FROM Games_Injured gi INNER JOIN Seasons s ON gi.season_id = s.season_id INNER JOIN Players p ON gi.player_id = p.player_id"; 
        let query2 = "select * from Seasons";
        let query3 = "select * from Players";

        try {
                db.pool.query(query1, function(error, rows, fields){
                    return firstData = rows;
                });
                
                db.pool.query(query2, function(error, rows, fields){
                    return secData = rows
                });
                db.pool.query(query3, function(error, rows, fields){
                    let thirdData = rows;
                    
                    res.render('injuries', {data: firstData, secData, thirdData});
                });
                
            
        } catch (error) {
            return error;
        }
             
        });

app.get('/injuries', async (req, res) => {
        
        let query1 = "SELECT gi.injury_id, p.player_id, s.season_year, s.season_id, CONCAT(p.player_fname, ' ', p.player_lname) as player_name, gi.injury_type, gi.games_missed FROM Games_Injured gi INNER JOIN Seasons s ON gi.season_id = s.season_id INNER JOIN Players p ON gi.player_id = p.player_id"; 
        let query2 = "select * from Seasons";
        let query3 = "select * from Players";

        try {
                db.pool.query(query1, function(error, rows, fields){
                    return firstData = rows;
                });
                
                db.pool.query(query2, function(error, rows, fields){
                    return secData = rows
                });
                db.pool.query(query3, function(error, rows, fields){
                    let thirdData = rows;
                    
                    res.render('injuries', {data: firstData, secData, thirdData});
                });
                
            
        } catch (error) {
            return error;
        }
             
        });  

 app.get('/standings', async (req, res) => {
        
        let query1 = "SELECT t.team_id, t.team_name, st.standings_id, s.season_id, s.season_year, st.wins, st.losses, st.points, st.ot FROM Standings st INNER JOIN Seasons s ON st.season_id = s.season_id INNER JOIN Teams t ON st.team_id = t.team_id";  
        let query2 = "select * from Seasons";
        let query3 = "select * from Teams";
    
        try {
                db.pool.query(query1, function(error, rows, fields){
                    
                    return standingsData = rows;
                });
                    
                db.pool.query(query2, function(error, rows, fields){
                    return seasonData = rows
                });

                db.pool.query(query3, function(error, rows, fields){
                    let teamData = rows;
                    
                    res.render('standings', {data: standingsData, seasonData, teamData});
                });
                    
                
        } catch (error) {
            return error;
        }
                 
        });  

app.get('/teams', function (req, res)
    {
        let query1 = "select * from Teams;";

        db.pool.query(query1, function (error, rows, fields) {
            res.render('teams', {data: rows});
        })
    });

app.get('/player_stats', async (req, res) =>
{
    let query1 = "select * from Player_Stats;";
    let query2 = "SELECT t.team_id, t.team_name, ps.stats_id, p.player_id, s.season_year, s.season_id, CONCAT(p.player_fname, ' ', p.player_lname) as player_name, ps.goals, ps.assists, ps.points, ps.games_played FROM Player_Stats ps INNER JOIN Seasons s ON ps.season_id = s.season_id INNER JOIN Players p ON ps.player_id = p.player_id INNER JOIN Teams t ON ps.team_id = t.team_id"; 
    let query3 = "select * from Players;"
    let query4 = "select * from Seasons;"
    let query5 = "select * from Teams;"

    try {
    db.pool.query(query1, function (error, rows, fields) {
        return firstData = rows
    })

    db.pool.query(query2, function (error, rows, fields) {
        return secData = rows
        
    })
    
    db.pool.query(query3, function (error, rows, fields) {
        return playerData = rows
            
    })

    db.pool.query(query4, function (error, rows, fields) {
        return seasonData = rows
                
    })

    db.pool.query(query5, function (error, rows, fields) {
        let teamData = rows
                
        res.render('player_stats', {data: firstData, secData, playerData, seasonData, teamData});
    })

    } catch (error) {
            return error
    }
});
    
app.post('/add-player-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    data.player_dob = moment(data.player_dob).toISOString();
    
     // Create the query and run it on the database
     query1 = `INSERT INTO Players (player_fname, player_lname, player_weight, player_height, player_dob, player_position) 
     VALUES ('${data.player_fname}', '${data.player_lname}', ${data.player_weight}, ${data.player_height}, '${data.player_dob}', '${data.player_position}')`;
     db.pool.query(query1, function(error, rows, fields){
 
         // Check to see if there was an error
         if (error) {
 
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.sendStatus(400);
         }
         else
         {
             // If there was no error, perform a SELECT * on Players
             query2 = `SELECT * FROM Players;`;
             db.pool.query(query2, function(error, rows, fields){
 
                 // If there was an error on the second query, send a 400
                 if (error) {
                     
                     // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                     console.log(error);
                     res.sendStatus(400);
                 }
                 // If all went well, send the results of the query back.
                 else
                 {
                    for (key in rows) {
                        rows[key].player_dob = moment(rows[key].player_dob).format("YYYY-MM-DD");
                    }
                    res.send(rows);
                 }
             })
         }
     })

});

app.post('/add-season-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
     // Create the query and run it on the database
     query1 = `INSERT INTO Seasons (season_year) 
     VALUES (${data.season_year})`;

     db.pool.query(query1, function(error, rows, fields){
        
         // Check to see if there was an error
         if (error) {
 
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.sendStatus(400);
         }
         else
         {
             // If there was no error, perform a SELECT * on Players
             query2 = `SELECT * FROM Seasons;`;
             db.pool.query(query2, function(error, rows, fields){
 
                 // If there was an error on the second query, send a 400
                 if (error) {
                     
                     // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                     console.log(error);
                     res.sendStatus(400);
                 }
                 // If all went well, send the results of the query back.
                 else
                 {
                    res.send(rows);
                 }
             })
         }
     })

});

app.post('/add-injury-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
     // Create the query and run it on the database
     query1 = `INSERT INTO Games_Injured (season_id, player_id, games_missed, injury_type) 
     VALUES (${data.season_id}, ${data.player_id}, ${data.games_missed}, '${data.injury_type}')`;

     db.pool.query(query1, function(error, rows, fields){
        
         // Check to see if there was an error
         if (error) {
 
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.sendStatus(400);
         }
         else
         {
             // If there was no error, perform a SELECT * on Players
             query2 = `SELECT * FROM Games_Injured;`;
             db.pool.query(query2, function(error, rows, fields){
 
                 // If there was an error on the second query, send a 400
                 if (error) {
                     
                     // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                     console.log(error);
                     res.sendStatus(400);
                 }
                 // If all went well, send the results of the query back.
                 else
                 {
                    res.send(rows);
                 }
             })
         }

     })
    });

app.post('/add-team-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Teams (team_name) 
     VALUES ('${data.team_name}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Players
            query2 = `SELECT * FROM Teams;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })

});

app.post('/add-player-stats-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Player_Stats (team_id, season_id, player_id, goals, assists, points, games_played) 
 VALUES (${data.team_id}, ${data.season_id}, ${data.player_id}, '${data.goals}', '${data.assists}', '${data.points}', '${data.games_played}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Players
            query2 = `SELECT * FROM Player_Stats;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    });
});

app.post('/add-standings-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Standings (team_id, season_id, wins, losses, ot, points) 
 VALUES (${data.team_id}, ${data.season_id}, ${data.wins}, ${data.losses}, ${data.ot}, ${data.points})`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Standings
            query2 = `SELECT * FROM Standings;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {

                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    });
});

app.delete('/delete-player-ajax/', function(req,res,next){
    let data = req.body;
    let player_id = parseInt(data.id);
    let delete_Player = `DELETE FROM Players WHERE player_id = ?`;
    // might need to delete from other tables too

    // Run the 1st query
    db.pool.query(delete_Player, [player_id], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(delete_Player, [player_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })});

app.delete('/delete-season-ajax/', function(req,res,next){
    let data = req.body;
    let season_id = parseInt(data.id);
    let delete_Season = `DELETE FROM Seasons WHERE season_id = ?`;
    // might need to delete from other tables too
    
    // Run the 1st query
    db.pool.query(delete_Season, [season_id], function(error, rows, fields){
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
    
        else
        {
            // Run the second query
            db.pool.query(delete_Season, [season_id], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })});

app.delete('/delete-injury-ajax/', function(req,res,next){
        let data = req.body;
        let injury_id = parseInt(data.id);
        let delete_Injury = `DELETE FROM Games_Injured WHERE injury_id = ?`;
        // might need to delete from other tables too
    
        // Run the 1st query
        db.pool.query(delete_Injury, [injury_id], function(error, rows, fields){
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
            }
    
            else
            {
                // Run the second query
                db.pool.query(delete_Injury, [injury_id], function(error, rows, fields) {
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
    })
});

app.delete('/delete-team-ajax/', function(req,res,next){
    let data = req.body;
    let team_id = parseInt(data.id);
    let delete_Team = `DELETE FROM Teams WHERE team_id = ?`;
    // might need to delete from other tables too

    // Run the 1st query
    db.pool.query(delete_Team, [team_id], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(delete_Team, [team_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-player-stats-ajax/', function(req,res,next){
    let data = req.body;
    let stats_id = parseInt(data.id);
    let delete_PlayerStats = `DELETE FROM Player_Stats WHERE stats_id = ?`;

    // Run the 1st query
    db.pool.query(delete_PlayerStats, [stats_id], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(delete_PlayerStats, [stats_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.delete('/delete-standings-ajax/', function(req,res,next){
    let data = req.body;
    let standings_id = parseInt(data.id);
    let delete_Standings = `DELETE FROM Standings WHERE standings_id = ?`;

    // Run the 1st query
    db.pool.query(delete_Standings, [standings_id], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(delete_Standings, [standings_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
    })
});

app.put('/put-player-ajax', function(req,res,next){
    let data = req.body;
  
    let player_id = parseInt(data.player_id);
    let player_weight = parseInt(data.player_weight);
    let player_height = parseInt(data.player_height);
    let player_dob = moment(data.player_dob).format("YYYY-MM-DD");
    let player_position = data.player_position;
  
    let queryUpdatePlayer = `UPDATE Players SET player_weight = ?, player_height = ?, player_dob = ?, player_position = ? WHERE player_id = ?`;
    let selectPlayer = `SELECT * FROM Players WHERE player_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatePlayer, [player_weight, player_height, player_dob, player_position, player_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectPlayer, [player_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.put('/put-season-ajax', function(req,res,next){
    let data = req.body;
  
    let season_id = parseInt(data.season_id);
    let season_year = parseInt(data.season_year);
  
    let queryUpdateSeason = `UPDATE Seasons SET season_year = ? WHERE season_id = ?`;
    let selectSeason = `SELECT * FROM Seasons WHERE season_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateSeason, [season_year, season_id], function(error, rows, fields){
            
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectSeason, [season_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.put('/put-injury-ajax', function(req,res,next){
    let data = req.body;
  
    let injury_id = parseInt(data.injury_id);
    let season_id = parseInt(data.season_id);
    let player_id = parseInt(data.player_id);
    let games_missed = parseInt(data.games_missed);
    let injury_type = data.injury_type;
  
    let queryUpdateInjury = `UPDATE Games_Injured SET season_id = ?, player_id = ?, games_missed = ?, injury_type = ? WHERE injury_id = ?`;
    let selectInjury = `SELECT * FROM Games_Injured WHERE injury_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateInjury, [season_id, player_id, games_missed, injury_type, injury_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectInjury, [injury_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

app.put('/put-team-ajax', function(req,res,next){
    let data = req.body;

    let team_id = parseInt(data.team_id);
    let team_name = data.team_name;

    let queryUpdateSeason = `UPDATE Teams SET team_name = ? WHERE team_id = ?`;
    let selectSeason = `SELECT * FROM Teams WHERE team_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateSeason, [team_name, team_id], function(error, rows, fields){

        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectSeason, [team_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-player-stats-ajax', function(req,res,next){
    let data = req.body;

    let stats_id = parseInt(data.stats_id);
    let team_id = parseInt(data.team_id);
    let season_id = parseInt(data.season_id);
    let player_id = parseInt(data.player_id);
    let goals = parseInt(data.goals);
    let assists = parseInt(data.assists);
    let points = parseInt(data.points);
    let games_played = parseInt(data.games_played);

    let queryUpdatePlayerStats = `UPDATE Player_Stats SET team_id = ?, season_id = ?, player_id = ?, goals = ?, assists = ?, points = ?, games_played = ? WHERE stats_id = ?`;
    let selectPlayerStats = `SELECT * FROM Player_Stats WHERE stats_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdatePlayerStats, [team_id, season_id, player_id, goals, assists, points, games_played], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectPlayerStats, [stats_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/put-standings-ajax', function(req,res,next){
    let data = req.body;

    let standings_id = parseInt(data.standings_id);
    let team_id = parseInt(data.team_id);
    let season_id = parseInt(data.season_id);
    let wins = parseInt(data.wins);
    let losses = parseInt(data.losses);
    let ot = parseInt(data.ot);
    let points = parseInt(data.points);

    let queryUpdateStandings = `UPDATE Standings SET team_id = ?, season_id = ?, wins = ?, losses = ?, ot = ?, points = ? WHERE standings_id = ?`;
    let selectStandings = `SELECT * FROM Standings WHERE standings_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateStandings, [team_id, season_id, wins, losses, ot, points, standings_id], function(error, rows, fields){
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {   
            // Run the second query
            db.pool.query(selectStandings, [standings_id], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});



/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
