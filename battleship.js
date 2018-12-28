var view={
	displayMessage: function (msg) {
		var messageArea=document.getElementById("messageArea");
		messageArea.innerHTML=msg;
	},

	displayHit: function(location){
		var cell=document.getElementById(location);
		cell.setAttribute("class","hit");
	},

	displayMiss: function(location) {
		var cell=document.getElementById(location);
		cell.setAttribute("class","miss");
	}
};

var model={
	boardSize: 7,
	numShips : 3,  //adding these prevents hardcording the boardsize ,num of ships and ship length ,handy if you may want to change contents later down the line
    shipLength: 3,//ship length is the number of locations each ship occupies
    shipsSunk : 0, //initializing the number of ships sunk to zero
    
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
            { locations: [0, 0, 0], hits: ["", "", ""] }, // we will randomly generate locations later on but for now we hardcode them for asier testing
            { locations: [0, 0, 0], hits: ["", "", ""] }],

    fire: function (guess) {

    	for (var i=0; i<this.numShips; i++){

    		var ship=this.ships[i];

     	    var index=ship.locations.indexOf(guess); //index of iterates through out the entire locations array searching for a match to guess
          
          if(ship.hits[index]==="hit") {
          	view.displayMessage("Oops,you already hit that location");
          	return true;
          }
           else if (index>=0){
          	ship.hits[index]="hit";
          	view.displayHit(guess);//function calls from variable view
          	view.displayMessage("HIT");
          	if(this.isSunk(ship)){
          		view.displayMessage("YOU SANK TREV'S BATTLESHIP");
          	    this.shipsSunk++; //this is a counter which adds +1 everytime the ship is hit
          	}
          	return true;
          }
      }
            view.displayMiss(guess);
            view.displayMessage("MUHAHAHA YOU MISSED TREV'S BATTLESHIP,TRY AGAIN");
          	return false;
          },

  
    isSunk: function (ship) { //this method takes in a ship and checks every possible location for a hit.It will return true if sunk,false if not sunk
      for (var i=0; i<this.shipLength; i++){//ships length is the number of location it occupies which is equal to the number of times it needs to be hit  inorder to be sunk.
      	  if(ship.hits[i] !== "hit"){
      	  	return false; //if there is any hits that does not have "hit" then the ship is not sunk yet therfeore return false
             }
           
         }
         return true;
      },

     generateShipLocations: function(){
     	var locations;
     	for(var i=0; i<this.numShips; i++){ //this.num ships for each ship row we want to generate locations for
     		do{
     			locations=this.generateShip(); //we use do while loop to first generate a location using the generateShip function
     		}while (this.collision(locations));//then call the collision function to check if it doesnt collide with another ship,if it returns true it means it collides therefore it will do(generate another location) until while returns false!
     		this.ships[i].locations=locations;//locations that return false aka dont collide are assigned to location indexes in thee model.ships array
     	}
     	console.log("Ships array: ");
     	console.log(this.ships);

     },

     generateShip: function(){
     	var direction = Math.floor(Math.random()*2);
     	var row,col;

     	if(direction===1){
     		row=Math.floor(Math.random() * this.boardSize);
     		col=Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); //if ship is placed horizontally because its 3 boxes long it should start between 0 and 4 so it doesnt overlap hence boardSize-3.however instead of 3 we use shipslength so if we change the length of the ship in future this function will still function the same
     	    } else{
     	    row=Math.floor(Math.random() * (this.boardSize - this.shipLength + 1)); // For when ship os placed vertically
     	    col=Math.floor(Math.random() * this.boardSize);
     	    }

     	   var newShiplocations=[];
     	 for (var i=0; i<this.shipLength; i++){
     	 	if (direction === 1) {
     	 	 newShiplocations.push(row + "" + (col + i)); //use parantheses to ensure i is added to col before being converted to a string
     	 		// first time through the loop i is 0 this is the starting column.second time it iterates its starting column plus 1 ,then third time its plus another 1 giving us 3 locations next to each other horizontally.
     	 	   } else {
     	 	   	newShiplocations.push((row + i) +"" + col); // for vertical
     	 	  }
     	 	  
     	 }
          return newShiplocations; // once we have filled the array with the one ships location we return it to the calling method generateship.locations
 },

     collision: function(locations){
     	for (var i=0; i<this.numShips; i++) {
     		var ship = this.ships[i];
     		for (var j=0; j<locations.length; j++) {
     			if(ship.locations.indexOf(locations[j])>=0) {
     				return true;
     			}
     		} 
     	}

     return false;
  }
};
    
//helper function to parse a guess from user	
function parseGuess(guess){
	var alphabet=["A", "B", "C", "D", "E", "F", "G"];

	if(guess===null || guess.length !==2){
		alert("oops! Please enter a letter and a character displayed on the board");
		}else{
			var firstChar=guess.charAt(0);
			var row=alphabet.indexOf(firstChar);
			var column=guess.charAt(1);

			if( isNaN (row)||isNaN (column)){
				alert("Oops! That is not on the board!");
			}
			else if(row<0 || row>=model.boardSize || column<0 || column>=model.boardSize){
				alert("OOOPS! Not on the board.try again");
			}
			else{
				return row + column;
			}
		}
		return null;
			
}



var controller={
	guesses: 0,

	processGuess: function(guess){
		var location=parseGuess(guess);
		if(location) {
			this.guesses++;
			var hit=model.fire(location);

			if(hit && model.shipsSunk=== model.numShips) {
				view.displayMessage("Trevor says: Aye Aye Captain.Congratulations,You sank all my battleships in " + this.guesses + " guesses! Want to play again?Just reload the page and you are good to go" );

			}
		}
	}

}

//Event Handlers


function handleFireButton() {
	var guessInput= document.getElementById("guessInput");
	var guess= guessInput.value.toUpperCase();
	
	controller.processGuess(guess);

	guessInput.value= "";
}

function handleKeyPress (e) {
	var fireButton=document.getElementById("fireButton");

	//in IE9 and earlier the event object does not get passed to event handler correctly
	//so we use windows.event instead
	e=e || window.event;
	if(e.keyCode===13) {
		fireButton.click() ;
		return false;
	}
}

window.onload = init;

function init()  {
	var fireButton=document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput=document.getElementById("guessInput");
	guessInput.onkeypress=handleKeyPress;
	//place the ships on the game board
		model.generateShipLocations();
}