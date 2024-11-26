console.log("hello");
function Player(name, marker) {
    let myName = name;
    let myMarker = marker;
    
    const getName = () => myName;
    const getMarker = () => myMarker;

    return {getName, getMarker}
}

function Cell(rowIndex, columnIndex) {
    let position = [rowIndex, columnIndex];
    let owner;
    let marker;

    const getPosition = () => position;
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

    return {getPosition, getOwner, getMarker, assign}
}


// USE MODULE PATTERN
/*
    GAMEBOARD module: IIFE fn factory pattern

    private var rows: 3,
    private var columns: 3

    private var board: 2d array [3][3] => populate with cell objects
    
    allWinnableArrays = array[row1, row2, row3, col1, col2, col3, diag1, diag2] 
    fn getWinner checks for win and return winner
        // iterate thru allWinnableArrays see if any one array is filled with same owner
        // if so, game is won return player who wins else return nothing
    fn checkDraw
        // else if all arrays have two unique owners then it's a draw, return true else false
    fn pruneAllArrays
        // find any array that has cells assigned to more than one owner, if so, remove that array from allWinnableArrays
    return {board, allWinnableArrays}
*/
const GameBoard = function() {
    const columns = 3;
    const rows = 3;

    const allBoardCells = function() {
        const board = [];
        for (let y=0; y<columns; y++){
            for(let x=0; x<rows; x++) {
                board.push(Cell(y, x));
            }
        }
        return board;
    }();
    const getBoardCells = () => allBoardCells;

    return {getBoardCells};
}
// MODULE PATTERN
/* GAME CONTROLLER (gameBoardObj, [playerObjs]): IIFE fn factory pattern
    winner = null
    while winner == null || isDraw
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        playRound(currentPlayer)
        winner = gameBoardObj.getWinner()
        isDraw = gameBoardObj.checkDraw()
        gameBoardObj.pruneAllArrays()
*/

function GameController (gameBoardObj, playerObjs){
    let winner;
    let isDraw = false;
    let currentPlayer = playerObjs[1];

    const playRound = () => null; // TODO: complete this later

    while (winner === null && isDraw === false) {
        currentPlayer = currentPlayer === playerObjs[0] ? playerObjs[1] : playerObjs[0];
        playRound(currentPlayer);
    }
}
