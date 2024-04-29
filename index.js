const main = function () {
    const gameboard = (function () {
        const nRows = 3, nCols = 3;
        const indexEmpty = -1, indexTie = 0;
        const board = (() => {
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
        const markOnBoard = (player, axis) => {
            const index = player.getIndex();
            board[axis.row][axis.col] = index;
        };
        const isWinArr = (arr) => {
            if (arr.includes(indexEmpty)) return false
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] !== arr[i + 1]) return false
            }
            return true
        };
        const checkWinner = () => {
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
        const checkAxisOccupied = (axis) => board[axis.row][axis.col] !== indexEmpty;
        return {
            currentBoard,
            markOnBoard,
            checkWinner,
            clearBoard,
            getTieIndex,
            checkAxisOccupied,
        }
    })();
    function createAxis(row, col) {return { row, col }}
    function createPlayer(name, index,) {
        const getName = () => name;
        const getIndex = () => index;
        const makeMove = function (axis) { gameboard.markOnBoard(this, axis) };
        return { getName, getIndex, makeMove }
    }
    const gameFlow = (function () {
        let isStart = false;
        let firstPlayer, secondPlayer, currentPlayer, winner;
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
            winner = undefined;
            gameboard.clearBoard();
            setCurrentPlayer(firstPlayer);
        };
        const checkResult = () => {
            const winnerIndex = gameboard.checkWinner();
            if (winnerIndex === firstPlayer.getIndex()) {
                winner = firstPlayer;
                isStart = false;
            }
            if (winnerIndex === secondPlayer.getIndex()) {
                winner = secondPlayer;
                isStart = false;
            }
            if (winnerIndex === gameboard.getTieIndex()) {
                isStart = false;
            }
        };
        const currentPlayerMakeMove = (axis) => {
            currentPlayer.makeMove(axis);
            checkResult();
            if (isStart) { toggleCurrentPlayer() }
        };
        const gameIsStart = () => isStart;
        const getWinner = () => winner;
        return {
            gameStart,
            setPlayers,
            getCurrentPlayer,
            currentPlayerMakeMove,
            gameIsStart,
            getWinner,
        }
    })();
    const displayController = (function () {
        const boardContainer = document.querySelector(".board-container");
        const btnStart = document.querySelector("#btn-start");
        const instruction = document.querySelector("h2");
        const displayBoard = () => {
            const board = gameboard.currentBoard();
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    const newButton = document.createElement("button");
                    newButton.classList.add("board-grid");
                    newButton.setAttribute("row", row);
                    newButton.setAttribute("col", col);
                    boardContainer.appendChild(newButton);
                }
            }
        };
        const updateMoveInstruction = (inst, player) => {
            inst.textContent = `${player.getName()}, please make your move 😀!`;
        };
        const clearBoard = () => {
            const btnGrids = document.querySelectorAll(".board-grid");
            btnGrids.forEach((btn => {
                btn.textContent = "";
            }));
        }
        const enableGridBtns = () => {
            const btnGrids = document.querySelectorAll(".board-grid");
            btnGrids.forEach((btn) => {
                const row = btn.getAttribute("row");
                const col = btn.getAttribute("col");
                const axis = createAxis(row, col);
                btn.addEventListener("pointerover", () => {
                    if (!gameboard.checkAxisOccupied(axis) && gameFlow.gameIsStart()) {
                        btn.classList.add("board-grid-hover");
                        btn.textContent = gameFlow.getCurrentPlayer().getIndex();
                    }
                });
                btn.addEventListener("pointerleave", () => {
                    if (!gameboard.checkAxisOccupied(axis) && gameFlow.gameIsStart()) {
                        btn.classList.remove("board-grid-hover");
                        btn.textContent = "";
                    }
                });
                btn.addEventListener("click", () => {
                    if (!gameboard.checkAxisOccupied(axis) && gameFlow.gameIsStart()) {
                        btn.classList.remove("board-grid-hover");
                        gameFlow.currentPlayerMakeMove(axis);
                        updateMoveInstruction(instruction, gameFlow.getCurrentPlayer());
                        if (!gameFlow.gameIsStart()) {
                            const winner = gameFlow.getWinner();
                            if (!!winner) { instruction.textContent = `Game over! 🎉 Winner is ${winner.getName()}!` }
                            else { instruction.textContent = "Game over! 🫱🏼‍🫲🏾 It's a tie!" }
                        }
                    }
                });
            });
        }
        const updateForm = () => {
            btnStart.addEventListener("click", () => {
                const namePlayer1 = document.querySelector("#name-player1").value;
                const namePlayer2 = document.querySelector("#name-player2").value;
                const player1 = createPlayer(namePlayer1, "⭕️");
                const player2 = createPlayer(namePlayer2, "❌");
                clearBoard();
                gameFlow.setPlayers(player1, player2);
                gameFlow.gameStart();
                btnStart.textContent = "Restart";
                updateMoveInstruction(instruction, gameFlow.getCurrentPlayer());
                enableGridBtns();
            });
        }
        return {
            displayBoard,
            updateForm,
        }
    })();

    displayController.displayBoard();
    displayController.updateForm();
}();