/**
 * Schelling's Model simulator
 * @author Tyler Weir
 */

const cell = "<div id='cell'></div>"

/**
 * Creates the table based on the parameters set by the user. 
 */
function createTable() {
	let size = document.getElementById("dimension").value;

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



// EVENT LISTENERS

document.getElementById("dimension").addEventListener("change", createTable);




