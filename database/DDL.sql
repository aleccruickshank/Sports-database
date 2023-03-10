SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

-- Initialize the table that tracks NHL seasons and their corresponding year.
create or replace table Seasons (
    season_id int(11) auto_increment NOT NULL,
    season_year year NOT NULL,
    PRIMARY KEY (season_id)
);

-- Initialize the table that tracks NHL teams and their names.
create or replace table Teams (
    team_id int(11) auto_increment unique NOT NULL,
    team_name varchar(255) NOT NULL,
    PRIMARY KEY (team_id)
);

-- Initialize the table that tracks NHL teams, and their win/loss record for the given season.
create or replace table Standings (
    standings_id int(11) auto_increment unique NOT NULL,
    team_id int(11),
    season_id int(11),
    wins int(11) NOT NULL,
    losses int(11) NOT NULL,
    ot int(11) NOT NULL,
    points int(11) NOT NULL,
    PRIMARY KEY (standings_id),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE
);

-- Initialize the table that tracks players and their statistics.
create or replace table Players (
    player_id int(11) auto_increment unique NOT NULL,
    player_fname varchar(255) NOT NULL,
    player_lname varchar(255) NOT NULL,
    player_weight int(11) NOT NULL,
    player_height int(11),
    player_dob date NOT NULL,
    player_position varchar(2) NOT NULL,
    Primary key (player_id)
);

-- Initialize the table that tracks injury reports of players.
create or replace table Games_Injured (
    injury_id int(11) auto_increment NOT NULL,
    season_id int(11),
    player_id int(11),
    games_missed int(11) NOT NULL,
    injury_type text,
    Primary key (injury_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE
);

-- Initialize the table that tracks statistics of players.
create or replace table Player_Stats (
    stats_id int(11) auto_increment unique NOT NULL,
    team_id int(11),
    season_id int(11),
    player_id int(11),
    goals int(11) NOT NULL,
    assists int(11) NOT NULL,
    points int(11) NOT NULL,
    games_played int(11) NOT NULL,
    Primary key (stats_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES Seasons(season_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

insert into Teams (team_name) values ("Vancouver Canucks");
insert into Teams (team_name) values ("New Jersey Devils");
insert into Teams (team_name) values ("Winnipeg Jets");
insert into Seasons (season_id, season_year) values (104, 2020);
insert into Seasons (season_id, season_year) values (105, 2021);
insert into Seasons (season_id, season_year) values (106, 2022);
insert into Standings (team_id, season_id, wins, losses, points) values (1, 106, 20, 10, 40);
insert into Standings (team_id, season_id, wins, losses, points) values (2, 106, 15, 15, 30);
insert into Standings (team_id, season_id, wins, losses, points) values (3, 106, 10, 20, 20);
insert into Players (player_fname, player_lname, player_weight, player_height, player_dob, player_position) values ("Elias", "Pettersson", 176, 188, '1998-11-12', "C");
insert into Players (player_fname, player_lname, player_weight, player_height, player_dob, player_position) values ("Jack", "Hughes", 175, 180, '2001-5-14', "C");
insert into Players (player_fname, player_lname, player_weight, player_height, player_dob, player_position) values ("Mark", "Scheifele", 207, 191, '1993-3-15', "C");
insert into Player_Stats (team_id, goals, assists, points, games_played, season_id, player_id) values (1, 20, 15, 35, 30, 106, 1);
insert into Player_Stats (team_id, goals, assists, points, games_played, season_id, player_id) values (2, 5, 20, 25, 30, 106, 2);
insert into Player_Stats (team_id, goals, assists, points, games_played, season_id, player_id) values (3, 10, 5, 15, 30, 106, 3);
insert into Games_Injured(season_id, player_id, games_missed, injury_type) values (106, 1, 4, "Lower-body");
insert into Games_Injured(season_id, player_id, games_missed, injury_type) values (106, 3, 5, "Ankle");
insert into Games_Injured(season_id, player_id, games_missed, injury_type) values (106, 2, 10, "Concussion");

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;