console.log("hello");
const PlayerOne = Player("Abhinav", "X");

function Player(name, marker) {
    let myName = name;
    let myMarker = marker;
    
    const getName = () => myName;
    const getMarker = () => myMarker;

    return {getName, getMarker}
}

function Cell([...position]) {
    let owner;
    let marker;

    const getPosition = () => position;
    const getRowIndex = () => position[0];
    const getColIndex = () => position[1];

    const getOwner = () => owner;
    const getMarker = () => marker;
    
    const assign = (playerObj) => {
        if (getOwner() === undefined) {
            owner = playerObj.getName();
            marker = playerObj.getMarker();
        }else {
            console.log(`Cell is already assigned by ${getOwner()}`);
        }
    }

    return {getPosition, getOwner, getRowIndex, getColIndex, getMarker, assign}
}

const GameBoard = function() {
    const columns = 3;
    const rows = 3;

    const allBoardCells = function() {
        const board = [];
        for (let x=0; x<rows; x++){
            for(let y=0; y<columns; y++) {
                board.push(Cell([x, y]));
            }
        }
        return board;
    }();
    const getAllCells = () => allBoardCells;
    const getCell = ([rowIndex, colIndex]) => allBoardCells.filter(cell => cell.getRowIndex() === rowIndex && cell.getColIndex() === colIndex)[0]

    const getRow = (rowIndex) => allBoardCells.filter(cell => cell.getRowIndex() === rowIndex);
    const getCol = (colIndex) => allBoardCells.filter(cell => cell.getColIndex() === colIndex);
    const getDiagOne = () => allBoardCells.filter(cell => cell.getPosition().every((val, index, arr) => val === arr[0]));

    const getDiagTwo = () => {
            const diagCellPos = function() {
                let arr = [];
                let y = columns -1;
                for (let x=0; x<rows; x++) {
                    arr.push([x,y--])
                }
                return arr;
            }();
            return diagCellPos.map(getCell);
    };

    const allBoardArrays = function(){
        const arr = [];
        for(let x=0; x<rows; x++){
            arr.push(getRow(x));
        }
        for(let y=0; y<columns; y++){
            arr.push(getCol(y));
        }
        arr.push(getDiagOne());
        arr.push(getDiagTwo());
        return arr;
    }();

    const getAllBoardArrays = () => allBoardArrays;
    return {getAllCells, getCell, getAllBoardArrays};
}();

function GameController() {
    let allBoardCells = GameBoard.getAllCells();
    let winnableArrays = GameBoard.getAllBoardArrays();

    const boardWrapper = document.querySelector(".board-wrapper");
    const players = [Player("Abhinav", "X"), Player("Sajeed", "O")];
    let activePlayer = players[0];

    const changeActivePlayer = () => { activePlayer = activePlayer === players[0]  ? players[1] : players[0] };

    // fn creates an interface which creates players
    // delete interface on submit

    // fn to "start" the game i.e build out the grid

    // keep looping between till draw/win is returned
    // after the user assigns (clicks a square)
    // prune the arrays,
    // check for a win,
    // check for a draw

    // if win, then disable the grid and
    allBoardCells.forEach( cell => {
        const newCellDiv = document.createElement("div");
        newCellDiv.classList.add("board-tile");
        newCellDiv.innerText = cell.getMarker() ?? "";
        newCellDiv.addEventListener("click", (e) => { 
            cell.assign(activePlayer);
            e.target.innerText = cell.getMarker();
            pruneWinnableArrays();
            const winner = getWinner();
            const isDraw = checkDraw();
            if (winner === undefined && !isDraw){
                changeActivePlayer();
            }
            else if (winner !== undefined) {
                alert(winner);
            }else if (isDraw) {
                alert("DRAW!");
            }
        });
        boardWrapper.appendChild(newCellDiv); 
    }) 

    const getWinner = () => {
        for (let winArr of winnableArrays) {
            if (winArr.every((val, index, arr) => val?.getOwner() === arr[0]?.getOwner())) {
                return winArr[0].getOwner();
            }
        }
        return undefined;
    }
    const checkLessThanTwoOwners = (arr) => {
        let owners = new Set();
        arr.forEach(cell => {
            if (cell?.getOwner()) {
                owners.add(cell.getOwner());
            }
        })
        return owners.size < 2;
    }
    const pruneWinnableArrays = () => { 
        winnableArrays = winnableArrays.filter(checkLessThanTwoOwners);
        console.log(winnableArrays);
    };
    const checkDraw = () => winnableArrays.length === 0;    


    return {pruneWinnableArrays, getWinner, checkDraw};
}
