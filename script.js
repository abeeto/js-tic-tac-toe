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


function GameInterfaceBuilder({toRemove, shouldStartGame, shouldMakePlayer}) {
    const makeStatusOverlay = (controller, outcomeObj) => {
        const playerDisplayDivNode = document.querySelector(".game-status-overlay");
        const outputByOutcome = () => {
            return (
                outcomeObj.continue && `${controller.getActivePlayer().getName()}'s Turn` ||
                outcomeObj.draw && `It's a draw!` ||
                outcomeObj.winner && `${controller.getActivePlayer().getName()} wins the game! <div class="restart-btn-wrapper"><button class="restart-btn">RESTART GAME?</button></div>`
            )
        }
        playerDisplayDivNode.innerHTML = `<div class="game-status-text">${outputByOutcome()}</div>`;
        const restartGameBtn = document.querySelector(".restart-btn");
        restartGameBtn?.addEventListener("click", ()=>{
            playerDisplayDivNode.removeChild(document.querySelector(".game-status-text"));
        })
    };

    const makeGameBoard = () => {
        const formHeadNode = document.querySelector("#createPlayersForm");
        const playersFormData = new FormData(formHeadNode);
        const playerNames = playersFormData.getAll("name");
        const playerMarker = playersFormData.getAll("marker");
        const playerOne = Player(playerNames[0], playerMarker[0]);
        const playerTwo = Player(playerNames[1], playerMarker[1]);

        
        const controller = GameController([playerOne, playerTwo]);
        makeStatusOverlay(controller, {continue: true, winner: false, draw: false})
        let allBoardCells = GameBoard.getAllCells();

        const boardWrapper = document.querySelector(".board-wrapper");
        allBoardCells.forEach( cell => {
            const newCellDiv = document.createElement("div");
            newCellDiv.classList.add("board-tile");
            newCellDiv.innerText = cell.getMarker() ?? "";
            newCellDiv.addEventListener("click", (e) => { 
                if (!e.target.disabled){
                    cell.assign(controller.getActivePlayer());
                    e.target.innerText = cell.getMarker();
                    const outcome = controller.handleOutcome();
                    makeStatusOverlay(controller, outcome);
                }
            });
            boardWrapper.appendChild(newCellDiv); 
        })
    }
    shouldStartGame && makeGameBoard();
    toRemove?.remove();

    const makePlayerInterface = () => {

        const wrapperParentNode = document.querySelector(".wrapper");
        wrapperParentNode.innerHTML = `
        <form name="createPlayers" id="createPlayersForm"action="#">
            <fieldset>
                <legend>Player One</legend>
                <label for="playerOneName">Name</label>
                <input id="playerOneName" name="name" type="text" minlength="1" maxlength="25" required>
                <label for="playerOneMarker">Marker</label>
                <input id="playerOneMarker" name="marker" type="text" maxlength="1" required>
            </fieldset>
            <fieldset>
                <legend>Player Two</legend>
                <label for="playerTwoName">Name</label>
                <input id="playerTwoName" name="name" type="text" minlength="1" maxlength="25" required>
                <label for="playerTwoMarker">Marker</label>
                <input id="playerTwoMarker" name="marker" type="text" maxlength="1" required>
            </fieldset>
            <input type="submit" class="player-create-submit" value="Start!">
        </form>
        `;
        const submitFormBtn = document.querySelector(".player-create-submit");
        submitFormBtn.addEventListener("click", (e) => {
            e.preventDefault();
            GameInterfaceBuilder({toRemove: wrapperParentNode,shouldStartGame: true,shouldMakePlayer: false});
        });
    }

    shouldMakePlayer && makePlayerInterface();

}

function GameController(players) {
    let winnableArrays = GameBoard.getAllBoardArrays();
    let activePlayer = players[0];
    const changeActivePlayer = () => { activePlayer = activePlayer === players[0]  ? players[1] : players[0] };
    const disableGrid = () => {
        const allTiles = document.querySelectorAll(".board-tile");
        console.log(allTiles);
        allTiles.forEach(tile => tile.disabled = true);
    }

    const handleOutcome = () => {
        pruneWinnableArrays();
        const winner = getWinner();
        const isDraw = checkDraw();
        if (winner === undefined && !isDraw){
            changeActivePlayer();
            return {continue: true, winner: false, draw: false};
        }
        else if (winner !== undefined) {
            disableGrid();
            return {continue: false, winner: true, draw: false}
        }else if (isDraw) {
            disableGrid();
            return {continue: false, winner: false, draw: true}
        }
    }

    const pruneWinnableArrays = () => { 
        const checkLessThanTwoOwners = (arr) => {
            let owners = new Set();
            arr.forEach(cell => {
                if (cell?.getOwner()) {
                    owners.add(cell.getOwner());
                }
            })
            return owners.size < 2;
        }

        winnableArrays = winnableArrays.filter(checkLessThanTwoOwners);
        console.log(winnableArrays);
    };
    
    const getWinner = () => {
        for (let winArr of winnableArrays) {
            if (winArr.every((val, index, arr) => val?.getOwner() === arr[0]?.getOwner())) {
                return winArr[0].getOwner();
            }
        }
        return undefined;
    }
    
    const checkDraw = () => winnableArrays.length === 0;    
    const getActivePlayer = () => activePlayer;
    return {handleOutcome, getActivePlayer  };
}

const startButtonNode = document.querySelector(".game-start-button");
startButtonNode.addEventListener("click", (e) => {
    GameInterfaceBuilder({toRemove: e.target,shouldStartGame: false,shouldMakePlayer: true});
});