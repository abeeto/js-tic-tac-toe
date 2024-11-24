console.log("hello");
/* 
    PLAYER OBJECT (name, marker): function factory pattern
    var name: name;
    var marker: marker;

    fn getName
    fn getMarker
*/
function Player(name, marker) {
    let myName = name;
    let myMarker = marker;
    
    const getName = () => myName;
    const getMarker = () => myMarker;

    return {getName, getMarker}
}



/*
    CELL OBJECT(rowIndex, colIndex): function factory pattern

    var position : [rowIndex, colIndex]
    var assignedTo : null
    var marker : null;

    fn getCellMarker() => return marker 
    fn getCellOwner() => return assignedTo
    fn assignCell(playerObj) => ONLY IF getCellOwner returns null THEN assignedTo = playerObj, marker = playerObj.getMarker();
    fn returnCellPosition() => position
*/


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
