// JavaScript source code
function start() {   //Declaring variable that enables the game
    var startButtonDiv = document.getElementById("startButton");
    var mainDiv = document.getElementById("div01");
    startButtonDiv.classList.add("hidden");
    startButtonDiv.classList.add("hidden");
    mainDiv.classList.remove("hidden");

}
// reference to the stage and output
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");

// keyboard listener
window.addEventListener("keydown", keydownHandler, false);

//The  map
var map =
[
  [0, 2, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 2, 0],
  [0, 2, 0, 1, 0, 0, 0, 0],
  [0, 2, 0, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

//The game objects map
var objects =
[
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 5, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0],
   [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
var EARTH = 0;
var MONEYBAGS = 1;
var GANGSTERS = 2;
var BANK = 3;
var HERO = 4;
var POLICE = 5;


var SIZE = 54;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Find the ship's and POLICE's start positions
var heroRow;
var heroColumn;
var policeRow;
var policeColumn;

for (var row = 0; row < ROWS; row++) {
    for (var column = 0; column < COLUMNS; column++) {
        if (objects[row][column] === HERO) {
            heroRow = row;
            heroColumn = column;
        }
        if (objects[row][column] === POLICE) {
            policeRow = row;
            policeColumn = column;
        }
    }
}

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//The game variables
var live = 12;
var money = 12;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way to the BANK.";

render();

function keydownHandler(event) {
    switch (event.keyCode) {
        case UP:
            if (heroRow > 0) {
                //Clear the current cell
                objects[heroRow][heroColumn] = 0;


                heroRow--;

                //Apply the HERO's new updated position 
                objects[heroRow][heroColumn] = HERO;
            }
            break;

        case DOWN:
            if (heroRow < ROWS - 1) {
                objects[heroRow][heroColumn] = 0;
                heroRow++;
                objects[heroRow][heroColumn] = HERO;
            }
            break;

        case LEFT:
            if (heroColumn > 0) {
                objects[heroRow][heroColumn] = 0;
                heroColumn--;
                objects[heroRow][heroColumn] = HERO;
            }
            break;

        case RIGHT:
            if (heroColumn < COLUMNS - 1) {
                objects[heroRow][heroColumn] = 0;
                heroColumn++;
                objects[heroRow][heroColumn] = HERO;
            }
            break;
    }

    //find out what kind of cell the ship is on
    switch (map[heroRow][heroColumn]) {
        case EARTH:
            gameMessage = "Keep running..."
            break;

        case GANGSTERS:
            fight();
            break;

        case MONEYBAGS:
            exchange();
            break;

        case BANK:
            endGame();
            break;
    }

    //Move the POLICE
    movePolice();


    //Find out if the ship is touching the monster
    if (objects[heroRow][heroColumn] === POLICE) {
        endGame();
    }

    //Subtract some live each turn
    live--;

    //Find out if the HERO has run out of live or money
    if (live <= 0 || money <= 0) {
        endGame();
    }

    //Render the game
    render();
}

function movePolice() {
    //The 4 possible directions that the POLICE can move
    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;

    //An array to store the valid direction that
    //the POLICE is allowed to move in
    var validDirections = [];

    //The final direction that the POLICE will move in
    var direction = undefined;

    //Find out what kinds of things are in the cells
    //that surround the POLICE. If the cells contain EARTH,
    //push the corresponding direction into the validDirections array
    if (policeRow > 0) {
        var thingAbove = map[policeRow - 1][policeColumn];
        if (thingAbove === EARTH) {
            validDirections.push(UP);
        }
    }
    if (policeRow < ROWS - 1) {
        var thingBelow = map[policeRow + 1][policeColumn];
        if (thingBelow === EARTH) {
            validDirections.push(DOWN);
        }
    }
    if (policeColumn > 0) {
        var thingToTheLeft = map[policeRow][policeColumn - 1];
        if (thingToTheLeft === EARTH) {
            validDirections.push(LEFT);
        }
    }
    if (policeColumn < COLUMNS - 1) {
        var thingToTheRight = map[policeRow][policeColumn + 1];
        if (thingToTheRight === EARTH) {
            validDirections.push(RIGHT);
        }
    }



    // choose one of thepossible directions and assign it to the direction variable if a valid direction was found
    if (validDirections.length !== 0) {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
    }

    //Move the POLICE 
    switch (direction) {
        case UP:
            //Clear the POLICE's current cell
            objects[policeRow][policeColumn] = 0;
            //decrement row by 1
            policeRow--;
            //Apply the policemans's new updated position to the array
            objects[policeRow][policeColumn] = POLICE;
            break;

        case DOWN:
            objects[policeRow][policeColumn] = 0;
            policeRow++;
            objects[policeRow][policeColumn] = POLICE;
            break;

        case LEFT:
            objects[policeRow][policeColumn] = 0;
            policeColumn--;
            objects[policeRow][policeColumn] = POLICE;
            break;

        case RIGHT:
            objects[policeRow][policeColumn] = 0;
            policeColumn++;
            objects[policeRow][policeColumn] = POLICE;
    }
}

function exchange() {
    //learn how much live the island has
    //and how much it should cost
    var bankLive = experience + money;
    var cost = Math.ceil(Math.random() * bankLive);

    //Let the player buy live if there's enough money
    //to afford it
    if (money > cost) {
        live += bankLive;
        money -= cost;
        experience += 2;

        gameMessage
          = "You get " + bankLive + " money bags"
          + " for " + cost + " money pieces."
    }
    else {
        //let the player know if he don't have enough money
        experience += 1;
        gameMessage = "You don't have enough money to buy live."
    }
}

function fight() {

    //The HEROs power
    var heroPower = Math.ceil((live + money) / 2);

    //A random number 
    var gangPower = Math.ceil(Math.random() * heroPower * 2);

    if (gangPower > heroPower) {
        //The pirates ransack the HERO
        var stolenGold = Math.round(gangPower / 2);
        money -= stolenGold;

        //increment experience
        experience += 1;

        //Update message
        gameMessage
          = "You fight and LOSE " + stolenGold + " money pieces."
          + " HERO's strength: " + heroPower
          + " GANGSTERS's strength: " + gangPower;
    }
    else {
        // win the GANGSTERS' money
        var pirateGold = Math.round(gangPower / 2);
        money += pirateGold;

        //Add  experience
        experience += 2;

        //Update  message
        gameMessage
          = "Congratulations, you fought and  WON " + pirateGold + " dollars."
          + " HERO's strength: " + heroPower
          + " GANGSTERS's strength: " + gangPower;
    }
}

function endGame() {
    if (map[heroRow][heroColumn] === BANK) {
        // score calculation
        var score = live + money + experience;

        // message
        gameMessage
          = "You made it! " + "Final Score: " + score;
        //cell.src = "../pictures/policeman2.png";
    }
        //else if(gameObjects[shipRow][shipColumn] === MONSTER)
    else if (objects[heroRow][heroColumn] == POLICE) {
        gameMessage
          = "Your HERO has been COUGHT by a  POLICE!";
    }
    else {
        //message
        if (money <= 0) {
            gameMessage += " You've run out of money!";

        }
        else {
            gameMessage += " You've run out of live!";
        }

        //This code has been disabled   //gameMessage
        //  += " Your crew throws you overboard!";
    }

    //Remove the keyboard listener to end the game
    window.removeEventListener("keydown", keydownHandler, false);
}

function render() {
    //Clear the stage of img cells


    if (stage.hasChildNodes()) {
        for (var i = 0; i < ROWS * COLUMNS; i++) {
            stage.removeChild(stage.firstChild);
        }
    }

    // looping through the map arrays to render
    for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {
            //Create a img tag called cell
            var cell = document.createElement("img");

            //Set  CSS class to "cell"
            cell.setAttribute("class", "cell");

            //Add the img to <div id="stage"> 
            stage.appendChild(cell);

            //look for the correct image for this map cell
            switch (map[row][column]) {
                case EARTH:
                    cell.src = "";
                    break;

                case MONEYBAGS:
                    cell.src = "money.png";
                    break;

                case GANGSTERS:
                    cell.src = "gangster.png";
                    break;

                case BANK:
                    cell.src = "bank.png";
                    break;
            }

            //Add the HERO and POLICE from the objects array
            switch (objects[row][column]) {
                case HERO:
                    cell.src = "hero.png";
                    break;

                case POLICE:
                    cell.src = "monster.png";
                    break;
            }

            //Position the cell
            cell.style.top = row * SIZE + "px";
            cell.style.left = column * SIZE + "px";
        }
    }

    //Display the message
    output.innerHTML = gameMessage;

    //Display the player's live, money, and experience
    output.innerHTML
      += "<br>Money: " + money + ", live: "
      + live + ", Experience: " + experience;
}