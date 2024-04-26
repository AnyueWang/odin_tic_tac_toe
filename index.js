const gameboard = (function () {
    const nRows = 3, nCols = 3, indexEmpty = -1;
    const board = (function () {
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
    const markOnBoard = function (player, axis) {
        const index = player.getIndex();
        board[axis.row][axis.col] = index;
    };
    const isWinArr = function (arr) {
        if (arr.includes(indexEmpty)) return false
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] !== arr[i + 1]) return false
        }
        return true
    };
    const checkWinner = function () {
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
        const arrCrossUp = board.map((eachRow, rowIndex)=>eachRow[nCols - rowIndex -1]);
        if (isWinArr(arrCrossUp)) return arrCrossUp[0]
        return indexEmpty
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
    }
})();

function createAxis(row, col) {
    return { row, col }
}

function createPlayer(name, index,) {
    const getName = () => name;
    const getIndex = () => index;
    const makeMove = function (axis, board) { board.markOnBoard(this, axis) };

    return { getName, getIndex, makeMove }
}

//testing

const player1 = createPlayer("Adam", 1);
const player2 = createPlayer("Eva", 2);

console.log(gameboard.checkWinner());
player1.makeMove(createAxis(0, 0), gameboard);
player1.makeMove(createAxis(1, 1), gameboard);
player1.makeMove(createAxis(2, 2), gameboard);
console.table(gameboard.currentBoard());
console.log(gameboard.checkWinner());

gameboard.clearBoard();
console.log(gameboard.checkWinner());
player2.makeMove(createAxis(2, 0), gameboard);
player2.makeMove(createAxis(1, 1), gameboard);
player2.makeMove(createAxis(0, 2), gameboard);
console.table(gameboard.currentBoard());
console.log(gameboard.checkWinner());

gameboard.clearBoard();
console.log(gameboard.checkWinner());
player2.makeMove(createAxis(0, 0), gameboard);
player2.makeMove(createAxis(1, 0), gameboard);
player2.makeMove(createAxis(2, 0), gameboard);
console.table(gameboard.currentBoard());
console.log(gameboard.checkWinner());

gameboard.clearBoard();
console.log(gameboard.checkWinner());
player1.makeMove(createAxis(0, 0), gameboard);
player1.makeMove(createAxis(0, 1), gameboard);
player1.makeMove(createAxis(0, 2), gameboard);
console.table(gameboard.currentBoard());
console.log(gameboard.checkWinner());