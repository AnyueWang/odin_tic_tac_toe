const gameboard = (function () {
    const nRows = 3, nCols = 3;
    const indexEmpty = -1, indexTie = 0;
    const board = ( ()=> {
        let arr = Array();
        for (let row = 0; row < nRows; row++) {
            arr.push(Array());
            for (let col = 0; col < nCols; col++) {
                arr[row].push(indexEmpty);
            }
        }
        return arr
    })();

    const currentBoard = () => board;
    const getTieIndex = () => indexTie;
    const markOnBoard =  (player, axis)=> {
        const index = player.getIndex();
        board[axis.row][axis.col] = index;
    };
    const isWinArr =  (arr)=> {
        if (arr.includes(indexEmpty)) return false
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] !== arr[i + 1]) return false
        }
        return true
    };
    const checkWinner =  () =>{
        for (let row = 0; row < nRows; row++) {
            const arrRow = board[row];
            if (isWinArr(arrRow)) return arrRow[0]
        }
        for (let col = 0; col < nCols; col++) {
            const arrCol = board.map(eachRow => eachRow[col]);
            if (isWinArr(arrCol)) return arrCol[0]
        }
        const arrCrossDown = board.map((eachRow, rowIndex) => eachRow[rowIndex]);
        if (isWinArr(arrCrossDown)) return arrCrossDown[0]
        const arrCrossUp = board.map((eachRow, rowIndex) => eachRow[nCols - rowIndex - 1]);
        if (isWinArr(arrCrossUp)) return arrCrossUp[0]
        for (let row = 0; row < nRows; row++) {
            if (board[row].includes(indexEmpty)) return indexEmpty
        }
        return indexTie
    };
    const clearBoard = function () {
        for (let row = 0; row < nRows; row++) {
            for (let col = 0; col < nCols; col++) {
                if (board[row] !== indexEmpty) board[row][col] = indexEmpty;
            }
        }
    };

    return {
        currentBoard,
        markOnBoard,
        checkWinner,
        clearBoard,
        getTieIndex,
    }
})();

function createAxis(row, col) {
    return { row, col }
}

function createPlayer(name, index,) {
    const getName = () => name;
    const getIndex = () => index;
    const makeMove = function (axis) { gameboard.markOnBoard(this, axis) };

    return { getName, getIndex, makeMove }
}

const gameFlow = (function () {
    let isStart = false;
    let firstPlayer, secondPlayer, currentPlayer, winner;
    let resultString;

    const setPlayers = (p1, p2) => {
        firstPlayer = p1;
        secondPlayer = p2;
    };
    const setCurrentPlayer = p => currentPlayer = p;
    const getCurrentPlayer = () => currentPlayer;
    const toggleCurrentPlayer = () => {
        if (currentPlayer === firstPlayer) currentPlayer = secondPlayer
        else currentPlayer = firstPlayer
    };
    const gameStart = () => {
        isStart = true;
        gameboard.clearBoard();
        setCurrentPlayer(firstPlayer);
    };
    const checkResult = () => {
        winnerIndex = gameboard.checkWinner();
        if (winnerIndex === firstPlayer.getIndex()) {
            winner = firstPlayer; 
            isStart = false; 
            resultString = `Game over! Winner is ${winner.getName()}!`;
        }
        if (winnerIndex === secondPlayer.getIndex()) {
            winner = secondPlayer; 
            isStart = false; 
            resultString = `Game over! Winner is ${winner.getName()}!`;
        }
        if (winnerIndex === gameboard.getTieIndex()) { 
            isStart = false;
            resultString = "Game over! It's a tie!"
        }
    };
    const currentPlayerMakeMove =  (axis) =>{
        currentPlayer.makeMove(axis);
        checkResult();
        if (isStart) { toggleCurrentPlayer() }
        else { console.log(resultString) }
    };
    const gameRestart = () => {
        gameStart();
    }

    return {
        gameStart,
        setPlayers,
        getCurrentPlayer,
        currentPlayerMakeMove,
        gameRestart,
    }
})();

//testing

const player1 = createPlayer("Adam", 1);
const player2 = createPlayer("Eva", 2);

gameFlow.setPlayers(player1, player2);
gameFlow.gameStart();
gameFlow.currentPlayerMakeMove(createAxis(1, 1));
gameFlow.currentPlayerMakeMove(createAxis(2, 2));
gameFlow.currentPlayerMakeMove(createAxis(0, 1));
gameFlow.currentPlayerMakeMove(createAxis(2, 1));
gameFlow.currentPlayerMakeMove(createAxis(2, 0));
gameFlow.currentPlayerMakeMove(createAxis(0, 2));
gameFlow.currentPlayerMakeMove(createAxis(0, 0));
gameFlow.currentPlayerMakeMove(createAxis(1, 0));
gameFlow.currentPlayerMakeMove(createAxis(1, 2));
console.table(gameboard.currentBoard());