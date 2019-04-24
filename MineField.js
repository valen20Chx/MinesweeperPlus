const colorTemplate = [
	'#333',
	'#00d',
	'#0d0',
	'#e00',
	'#b03',
	'#05c',
	'#000',
	'#ddd',
];


class Square {
	constructor(isBomb = false) {
		this.isBomb = isBomb;
		this.nbNeighbour = 0;
		this.isHidden = true;
		this.isFlagged = false;
	}

	set_isBomb(isBomb) {
		this.isBomb = isBomb;
	}

	get_isBomb() {
		return this.isBomb;
	}

	set_nbNeighbour(nbNeighbour) {
		this.nbNeighbour = nbNeighbour;
	}

	get_nbNeighbour() {
		return this.nbNeighbour;
	}

	set_isHidden(isHidden) {
		this.isHidden = isHidden;
	}

	get_isHidden() {
		return this.isHidden;
	}

	set_isFlagged(isFlagged) {
		this.isFlagged = isFlagged;
	}

	get_isFlagged() {
		return this.isFlagged;
	}
}

class Minefield {
	constructor(width, height, percentBomb, seed) {
		this.width = width;
		this.height = height;
		this.percentBomb = percentBomb;
		this.seed = seed;

		this.nbBomb = Math.floor((width * height) * (percentBomb / 100));
		this.nbFlag = 0;

		// state : 0 is none, 1 is won, -1 is lost
		this.state = 0;
		this.grid = [];

		for(let i = 0; i < (this.width * this.height); i++) {
			this.grid.push(new Square());
		}

		this.create();
	}

	get_Square(X, Y) {
		return (this.grid[(Y * this.width) + X]);
	}

	create() {
		// Create Bombs
		for(let i = 0; i < this.nbBomb; i++) {
			let temPos;
			while(true) {
				temPos = Math.floor(Math.random() * (this.width * this.height));
				if(!this.grid[temPos].get_isBomb()) {
					break;
				}
			}
			this.grid[temPos].set_isBomb(true);
		}

		for(let j = 0; j < this.height; j++) {
			for(let i = 0; i < this.width; i++) {
				let count;
				if(!this.get_Square(i, j).get_isBomb()) {
					count = 0;
					if(i != 0) {
						if(j != 0) {
							if(this.get_Square(i - 1, j - 1).get_isBomb()) count++;
						}
						if(j != (this.height - 1)) {
							if(this.get_Square(i - 1, j + 1).get_isBomb()) count++;
						}
						if(this.get_Square(i - 1, j).get_isBomb()) count++;
					}
					if(i != this.width -1) {
						if(j != 0) {
							if(this.get_Square(i + 1, j - 1).get_isBomb()) count++;
						}
						if(j != (this.height - 1)) {
							if(this.get_Square(i + 1, j + 1).get_isBomb()) count++;
						}
						if(this.get_Square(i + 1, j).get_isBomb()) count++;
					}
					if(j != 0) {
						if(this.get_Square(i, j - 1).get_isBomb()) count++;
					}
					if(j != (this.height - 1)) {
						if(this.get_Square(i, j + 1).get_isBomb()) count++;
					}
				}
				this.get_Square(i, j).set_nbNeighbour(count);
			}
		}
	}

	print_in_table(table) {
		var tbody = document.createElement('tbody');
		table.appendChild(tbody);

		for(let j = 0; j < this.height; j++) {
			let tr = document.createElement('tr');
			tbody.appendChild(tr);
			for(let i = 0; i < this.width; i++) {
				let td = document.createElement('td');
				tbody.appendChild(td);

				td.classList.add(`x${i}`);
				td.classList.add(`y${j}`);

				let char;

				td.style.margin = '0';

				if(this.get_Square(i, j).get_isBomb()) {
					char = '*';
					td.style.backgroundColor = "rgb(255, 0, 0)";
				}
				else if(this.get_Square(i, j).get_nbNeighbour() == 0) {
					td.style.backgroundColor = "rgb(0, 0, 0)";
					char = ' ';
				} else{
					char = this.get_Square(i, j).get_nbNeighbour();
					td.style.backgroundColor = "rgb(0, 250, 0)";

				}

				let txtNode = document.createTextNode(char);
				td.appendChild(txtNode);
			}
		}
	}

	draw(context, x, y, w, h) {
		drawRect(context, x, y, w, y, '#333');
		var squareSize;
		var xOffset;
		var yOffset;
		if(this.width > this.height) {
			squareSize = h / this.height;
			yOffset = h - (this.width * squareSize);
			xOffset = 0;
		} else {
			squareSize = w / this.width;
			yOffset = 0;
			xOffset = w - (this.height * squareSize);
		}

		for(let j = 0; j < this.height; j++) {
			for(let i = 0; i < this.width; i++) {
				let squareChar;
				let txtColor;
				let backColor;
				if(this.get_Square(i, j).get_isFlagged()) {
					squareChar = 'F';
					txtColor = "#f00";
					backColor = '#aaa';
				} else if(this.get_Square(i, j).get_isHidden()) {
					squareChar = ' ';
					backColor = '#aaa';
				} else if(this.get_Square(i, j).get_isBomb()) {
					squareChar = '*';
					txtColor = "#000";
					backColor = '#e00';
				} else if(this.get_Square(i, j).get_nbNeighbour() == 0) {
					squareChar = ' ';
					backColor = '#ccc';
				} else {
					squareChar = this.get_Square(i, j).get_nbNeighbour();
					txtColor = colorTemplate[this.get_Square(i, j).get_nbNeighbour()];
					backColor = '#ccc';
				}
				drawRect(context, (x + xOffset + (i * squareSize)),
					(y + yOffset + (j * squareSize)), squareSize, squareSize, backColor);
				drawText(context, (x + xOffset + (i * squareSize) + (squareSize / 3)),
					(y + yOffset + (j * squareSize) + (squareSize / 2)), squareChar, 15, 'Arial', true, txtColor);
			}
		}

		for(let i = 0; i < (this.width - 1); i++) {
			drawLine(context, x + xOffset + (i * squareSize) + squareSize, y + yOffset, x + xOffset + (i * squareSize) + squareSize, y + yOffset + h);
		}
		for(let i = 0; i < (this.height- 1); i++) {
			drawLine(context, x + xOffset, y + yOffset + (i * squareSize) + squareSize, x + xOffset + w, y + yOffset + (i * squareSize) + squareSize);
		}
	}

	reveal(x, y) {
		if(this.get_Square(x, y).get_isFlagged() || !this.get_Square(x, y).get_isHidden()) {
			return;
		}
		console.log('Revealing : ', x, y);
		this.get_Square(x, y).set_isHidden(false);
		if(this.get_Square(x, y).get_nbNeighbour() == 0) {

			if(x != 0) {
				if(y != 0) {
					if(this.get_Square(x - 1, y - 1).get_isHidden())
						this.reveal(x - 1, y - 1);
				}
				if(y != (this.height - 1)) {
					if(this.get_Square(x - 1, y + 1).get_isHidden())
						this.reveal(x - 1, y + 1);
				}
				if(this.get_Square(x - 1, y).get_isHidden())
					this.reveal(x - 1, y);
			}
			if(x != this.width -1) {
				if(y != 0) {
					if(this.get_Square(x + 1, y - 1).get_isHidden())
						this.reveal(x + 1, y - 1);
				}
				if(y != (this.height - 1)) {
					if(this.get_Square(x + 1, y + 1).get_isHidden())
						this.reveal(x + 1, y + 1);
				}
				if(this.get_Square(x + 1, y).get_isHidden())
					this.reveal(x + 1, y);
			}
			if(y != 0) {
				if(this.get_Square(x, y - 1).get_isHidden())
					this.reveal(x, y - 1);
			}
			if(y != (this.height - 1)) {
				if(this.get_Square(x, y + 1).get_isHidden())
					this.reveal(x, y + 1);
			}
		}
		else if(this.get_Square(x, y).get_isBomb()) {
			this.state = -1;
		}
	}

	flag(x, y) {
		if(!this.get_Square(x, y).get_isHidden()) {
			return;
		}
		this.get_Square(x, y).set_isFlagged(!this.get_Square(x, y).get_isFlagged());
		if(this.get_Square(x, y).get_isFlagged()) {
			this.nbFlag++;
		} else {
			this.nbFlag--;
		}
	}

	play(type, mX, mY, x, y, w, h) {
		var squareSize;
		var xOffset;
		var yOffset;
		if(this.width > this.height) {
			squareSize = h / this.height;
			yOffset = h - (this.width * squareSize);
			xOffset = 0;
		} else {
			squareSize = w / this.width;
			yOffset = 0;
			xOffset = w - (this.height * squareSize);
		}
		var sX = Math.floor((mX - xOffset - x) / squareSize);
		//Math.floor((mX - xOffset - x) / w);
		var sY = Math.floor((mY - yOffset - y) / squareSize);
		//Math.floor((mY - yOffset - y) / h);
		switch(type) {
			case 0: // Play 'Dig' reveal
			console.log("Dig", sX, sY);
			this.reveal(sX, sY);
			
			// Plays on a bomb
			if(this.get_Square(sX, sY).get_isBomb() && !this.get_Square(sX, sY).get_isFlagged()) {
				this.state = -1;
			}
			break;
			case 1: // Play 'Flag' Flag
			console.log("Flag", sX, sY);
			this.flag(sX, sY);
			break;
		}
	}

	update_state() {
		let allBombFlagged = true;
		for(let i = 0; i < this.width * this.height; i++) {
			if(!this.grid[i].get_isBomb() && this.grid[i].get_isFlagged()) {
				allBombFlagged = false;
			}
		}
		if(allBombFlagged && this.nbBomb == this.nbFlag) {
			this.state = 1;
			console.log("flagged all bombs");
		} else {
			console.log("not flagged all bombs");
		}
	}

	get_nbFlag() {
		return this.nbFlag;
	}

	get_nbBomb() {
		return this.nbBomb;
	}

	get_state() {
		return this.state;
	}
}