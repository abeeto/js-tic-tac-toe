console.log("hello");
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

    const allArraysToWin = function(){
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

    const getArraysToWin = () => allArraysToWin;

    return {getAllCells, getCell, getArraysToWin};
}

function GameController(gameBoardObj, playerObjs) {
    let winnableArrays = gameBoardObj.getArraysToWin();
    const getWinner = () => {
        for (let winArr of winnableArrays) {
            if (winArr.every((val, index, arr) => val?.getOwner() === arr[0]?.getOwner())) {
                return winArr[0].getOwner();
            }
        }
        return null;
    }
    const checkForTwoOwners = (arr) => {
        let owners = new Set();
        arr.forEach(cell => {
            if (cell?.getOwner()) {
                owners.add(cell.getOwner());
            }
        })
        return owners.size < 2;
    }
    const pruneWinnableArrays = () => { 
        winnableArrays = winnableArrays.filter(checkForTwoOwners);
        console.log(winnableArrays);
    };
    const checkDraw = () => winnableArrays.length === 0;    

    return {pruneWinnableArrays, getWinner, checkDraw};
}
