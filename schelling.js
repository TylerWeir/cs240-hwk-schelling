/**
 * Schelling's Model simulator
 * @author Tyler Weir
 */

// Global Constants
const cell = "<div id='cell'></div>"

// Global Variables
var simBoard; 

/**
 * Creates the table based on the parameters set by the user. 
 * @param size
 */
function createTable(size) {

	// Generate the HTML for the table
	var table = "<table>";
	for (let i = 0; i < size; i++) {
		table += "<tr>"
		for (let j = 0; j < size; j++) {
			table += "<td>"+cell+"</td>";
		}
		table += "</tr>";
	}
	
	let board = document.getElementById("board");
	board.innerHTML = table;
}

/**
 * Build the sim_board according to the new size and other parameters.
 */
function initBoard(size) {
	simBoard = [];

	let popSplit = document.getElementById("popRatio").value;
	let numVacant = document.getElementById("vacantRatio").value;
	
	// Iterate over every cell
	for (let i = 0; i < size; i++) {
		var row = [];
		for (let j = 0; j < size; j++) {
			// Make empty?
			if (Math.random() < numVacant) {
				row.push(0);
			} else {
				// What population?
				if(Math.random() < popSplit) {
					row.push(1);
				} else {
					row.push(2);
				}
			}
		}
		simBoard.push(row);
	}
}

/**
 * Makes the displayed board represent the simBoard.
 */
function displayBoard(size) {
	
	let cells = document.querySelectorAll("div[id=cell]");
	let popOneColor = document.getElementById("popXcolor").value;
	let popTwoColor = document.getElementById("popYcolor").value;
	
	var x;
	var y;
	for (let i = 0; i < cells.length; i++) {
		x = (i+1)%size;
		y = Math.floor(i/size);

		//Style the cell accordingly
		if (simBoard[x][y] == 1) {
			cells[i].style.backgroundColor = popOneColor;
		} else if (simBoard[x][y] == 2) {
			cells[i].style.backgroundColor = popTwoColor;
		} else {
			cells[i].style.backgroundColor = "white";
		}
	}
}



/////// EVENT LISTENERS ///////

// Resize board when 'Dimension' changes
let dimension = document.getElementById("dimension");
dimension.addEventListener("change", function () {
	let size = document.getElementById("dimension").value;
	createTable(size);
	initBoard(size);
	displayBoard(size);
});



// Change population colors

//




