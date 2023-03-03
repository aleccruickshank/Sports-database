/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 7938;

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
        let query1 = "select player_fname, player_lname, player_weight, player_height, player_dob, player_position from Players;"; 
        
        db.pool.query(query1, function(error, rows, fields){

            res.render('index', {data: rows});
        })
    });  
    
app.post('/add-player-ajax', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

     // Create the query and run it on the database
     query1 = `INSERT INTO Players (player_fname, player_lname, player_weight, player_height, player_dob, player_position) 
     VALUES ('${data.player_fname}', '${data.player_lname}', ${data.player_weight}, ${data.player_height}, ${data.player_dob}, '${data.player_position}')`;
     db.pool.query(query1, function(error, rows, fields){
 
         // Check to see if there was an error
         if (error) {
 
             // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
             console.log(error)
             res.sendStatus(400);
         }
         else
         {
             // If there was no error, perform a SELECT * on bsg_people
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
                     res.send(rows);
                 }
             })
         }
     })


});

app.put('/put-player-ajax', function(req,res,next){
    let data = req.body;
  
    let player= parseInt(data.fullname);
    let weight = parseInt(data.weight);
    let height = parseInt(data.height);
    let dob = parseInt(data.dob);
    let position = parseInt(data.position);
  
    let queryUpdatePlayer = `UPDATE Players SET player_weight = ?, player_height = ?, player_dob = ?, player_position = ? WHERE player_id = ?`;
    let selectPlayer = `SELECT * FROM Players WHERE id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatePlayer, [player, weight, height, dob, position], function(error, rows, fields){
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
                  db.pool.query(selectPlayer, [player], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
