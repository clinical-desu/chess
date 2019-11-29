//initialize variables;
const table = document.getElementById('table');
const row = document.createElement('tr');
const cell = document.createElement('td');
const winKing = document.createElement('h1');
const winText = document.createElement('h2');

//initialize end game screen;
const end = document.getElementById('end');
end.style.visibility = 'hidden';

//creating figure object;
const figures = {
    pawn: document.createElement('div'),
    rooks: document.createElement('div'),
    knights: document.createElement('div'),
    bishops: document.createElement('div'),
    queen: document.createElement('div'),
    king: document.createElement('div'),
};

//creating board;
let bInit = () => {
    for (let i = 0; i < 8; i++) {
        row.setAttribute('id', `${i}`);
        row.textContent = '';
        for (let j = 0; j < 8; j++) {
            cell.setAttribute('id', `${j}-${i}`);
            cell.textContent = '';
            cell.style.backgroundColor = `${["#eeeed2", "#630"][(i + j) % 2]}`;
            row.appendChild(cell.cloneNode(true));
        }
        table.appendChild(row.cloneNode(true));
    }
};

//initial state of board;
let initBoard = () => {
    let allCells = table.querySelectorAll('td');
    for (let i = 0, k = 0; i < allCells.length; i++, k++) {

        if (k > 7) {
            k = 0;
        }

        //initialize figures;
        figures.pawn.textContent = '♙';
        figures.rooks.textContent = '♖';
        figures.knights.textContent = '♘';
        figures.bishops.textContent = '♗';
        figures.queen.textContent = '♕';
        figures.king.textContent = '♔';

        //initialize figures on board;
        function notPawns(k) {
            switch (k) {
                case 0:
                case 7:
                    allCells[i].appendChild(figures.rooks.cloneNode(true));
                    break;
                case 1:
                case 6:
                    allCells[i].appendChild(figures.knights.cloneNode(true));
                    break;
                case 2:
                case 5:
                    allCells[i].appendChild(figures.bishops.cloneNode(true));
                    break;
                case 3:
                    allCells[i].appendChild(figures.queen.cloneNode(true));
                    break;
                case 4:
                    allCells[i].appendChild(figures.king.cloneNode(true));
                    break;
            }
        }

        //color white or black;
        for (let key in figures) {
            let figure = figures[key];
            figure.setAttribute('style', 'text-align: center; font-size: 40px;');
            figure.setAttribute('draggable', 'true');
            if (allCells[i].id === `${k}-0`) {
                figure.style.color = 'white';
            } else if (allCells[i].id === `${k}-1`) {
                figure.style.color = 'white';
            } else {
                figure.style.color = 'black';
            }
        }

        //appending figures to board;
        switch (allCells[i].id) {
            case `${k}-0`:
                allCells[i].className += 'changePawn';
                notPawns(k);
                break;
            case `${k}-1`:
                allCells[i].appendChild(figures.pawn.cloneNode(true));
                break;
            case `${k}-6`:
                allCells[i].appendChild(figures.pawn.cloneNode(true));
                break;
            case `${k}-7`:
                allCells[i].className += 'changePawn';
                notPawns(k);
                break;
        }
    }
};

//adding drag and drop to figures;
let figuresListeners = () => {
    let allFigures = table.querySelectorAll('div');
    let allCells = table.querySelectorAll('td');
    let storeFigure = null;
    let nextMove = [];
    let suggestedElements = [];

    for (const figure of allFigures) {
        figure.addEventListener('dragstart', dragStart);

        function dragStart(e) {
            storeFigure = e.target;
            let selected = this.parentElement.id.split('-');
            let r = parseInt(selected[0]);
            let c = parseInt(selected[1]);
            e.target.style.opacity = '0.1';

            setTimeout(function () {
                e.target.style.visibility = 'hidden';
            }, 1);

            let pMove = (r, c, moves) => {
                let nextMove = [];
                for (let i = 0; i < moves.length; i++) {
                    let mR = r + moves[i][0];
                    let mC = c + moves[i][1];
                    let element = `${mR}-${mC}`;
                    if (!outOfBoard(mR, mC)) {
                        if (i === 0) {
                            for (let k = 0; k < allCells.length; k++) {
                                if (allCells[k].id === element && allCells[k].childNodes.length === 0) {
                                    nextMove.push([mR, mC]);
                                }
                            }
                        } else if (i === 1) {
                            let plusOne = this.style.color === 'black' ? `${mR}-${mC + 1}` : `${mR}-${mC - 1}`;
                            if (c === 6 && this.style.color === 'black' || c === 1 && this.style.color === 'white') {
                                for (let j = 0; j < allCells.length; j++) {
                                    if (allCells[j].id === plusOne && allCells[j].childNodes.length === 0) {
                                        nextMove.push([mR, mC]);
                                    }
                                }
                            }
                        } else if (i > 1) {
                            for (let i = 0; i < allCells.length; i++) {
                                if (allCells[i].id === element && allCells[i].childNodes.length === 1) {
                                    if (allCells[i].lastElementChild.style.color !== this.style.color) {
                                        nextMove.push([mR, mC]);
                                    }
                                }
                            }
                        }
                    }
                }
                return nextMove;
            };

            let rbqMove = (r, c, moves) => {
                let nextMove = [];
                for (let move of moves) {
                    let mR = r + move[0];
                    let mC = c + move[1];
                    let element = `${mR}-${mC}`;
                    let s = true;
                    while (s && !outOfBoard(mR, mC)) {
                        for (let i = 0; i < allCells.length; i++) {
                            if (allCells[i].id === element) {
                                if (allCells[i].childNodes.length &&
                                    allCells[i].lastElementChild.style.color === this.style.color) {
                                    s = false;
                                } else {
                                    let axisElement = `${mR}-${mC}`;
                                    for (let k = 0; k < allCells.length; k++) {
                                        if (allCells[k].id === axisElement) {
                                            if (allCells[k].childNodes.length) {
                                                s = false;
                                                if (allCells[k].lastElementChild.style.color !== this.style.color) {
                                                    s = false;
                                                    nextMove.push([mR, mC]);
                                                }
                                            } else {
                                                nextMove.push([mR, mC]);
                                            }
                                        }
                                    }
                                    mR += move[0];
                                    mC += move[1];
                                }
                            }
                        }
                    }
                }
                return nextMove;
            };

            let kkMove = (r, c, moves) => {
                let nextMove = [];
                for (let move of moves) {
                    let mR = r + move[0];
                    let mC = c + move[1];
                    let element = `${mR}-${mC}`;
                    if (!outOfBoard(mR, mC)) {
                        for (let i = 0; i < allCells.length; i++) {
                            if (allCells[i].id === element) {
                                if (allCells[i].lastElementChild === null ||
                                    allCells[i].lastElementChild.style.color !== this.style.color) {
                                    nextMove.push([mR, mC]);
                                }
                            }
                        }
                    }
                }
                return nextMove;
            };

            let outOfBoard = function (i, j) {
                return (i < 0 || i >= 8 || j < 0 || j >= 8);
            };

            switch (this.textContent) {
                case '♙':
                    let mPawn = [];
                    this.style.color === 'black' ?
                        mPawn = [[0, -1], [0, -2], [1, -1], [-1, -1]] :
                        mPawn = [[0, 1], [0, 2], [1, 1], [-1, 1]];
                    nextMove = pMove(r, c, mPawn);
                    break;
                case '♖':
                    let mRook = [
                        [0, 1], [0, -1], [1, 0], [-1, 0]
                    ];
                    nextMove = rbqMove(r, c, mRook);
                    break;
                case '♘':
                    let mKnights = [
                        [-1, -2], [-2, -1], [1, -2], [-2, 1],
                        [2, -1], [-1, 2], [2, 1], [1, 2]
                    ];
                    nextMove = kkMove(r, c, mKnights);
                    break;
                case '♗':
                    let mBishop = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    nextMove = rbqMove(r, c, mBishop);
                    break;
                case '♕':
                    let mFQueen = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    let mSQueen = [
                        [0, 1], [0, -1], [1, 0], [-1, 0]
                    ];
                    nextMove = rbqMove(r, c, mFQueen).concat(rbqMove(r, c, mSQueen));
                    break;
                case '♔':
                    let mKing = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1],
                        [0, 1], [0, -1], [1, 0], [-1, 0]
                    ];
                    nextMove = kkMove(r, c, mKing);
                    break;
            }

            let suggestNextMoves = function (nextMoves) {
                let move = nextMoves.map(elem => (elem.join('-')));
                for (let i = 0; i < allCells.length; i++) {
                    if (move.indexOf(allCells[i].id) > -1) {
                        allCells[i].style.boxShadow = 'inset 0 0 15px #E65100';
                        suggestedElements.push(allCells[i]);
                    }
                }
            };

            suggestNextMoves(nextMove);
        }
    }

    for (const cell of allCells) {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', dragDrop);

        function dragOver(e) {
            e.preventDefault();
        }

        function dragDrop() {
            let changePawn = () => {
                for (let i = 0; i < allCells.length; i++) {
                    if (allCells[i].className === 'changePawn') {
                        if (allCells[i].id === this.id) {
                            storeFigure.textContent = '♕';
                        }
                    }
                }
            };

            setTimeout(function () {
                for (let k = 0; k < allFigures.length; k++) {
                    allFigures[k].style.opacity = '1';
                    allFigures[k].style.visibility = 'visible';
                }
            }, 1);

            for (let i = 0; i < suggestedElements.length; i++) {
                if (this === suggestedElements[i]) {
                    if (this.childNodes.length === 0) {
                        suggestedElements[i].append(storeFigure);
                        changePawn();
                    } else if (this.childNodes.length === 1 && storeFigure.style.color !== this.lastChild.style.color) {
                        this.lastChild.remove();
                        suggestedElements[i].append(storeFigure);
                        changePawn();
                    }
                }
                suggestedElements[i].style.boxShadow = 'none';
            }

            suggestedElements = [];
            endGame();
        }
    }
};

//ending of game;
let endGame = () => {
    let allFigures = table.querySelectorAll('div');
    let arr = [];
    for (let i = 0; i < allFigures.length; i++) {
        if (allFigures[i].textContent.includes('♔')) {
            arr.push(allFigures[i]);
        }
    }
    if (arr.length === 1) {
        arr[0].style.color === 'black' ? winText.style.color = 'black' : winText.style.color = 'white';
        arr[0].style.color === 'black' ? winKing.style.color = 'black' : winKing.style.color = 'white';
        winText.textContent = `You win ${arr[0].style.color}`;
        winKing.textContent = '♔';
        table.style.visibility = 'hidden';
        end.style.visibility = 'visible';
        end.prepend(winText);
        end.prepend(winKing);
    }
};

//clearing the board;
let clearBoard = () => {
    let allFigures = table.querySelectorAll('div');
    for (let i = 0; i < allFigures.length; i++) {
        allFigures[i].remove();
    }
};

//event for new game;
let button = document.getElementById('end-button');
button.addEventListener('click', function () {
    end.style.visibility = 'hidden';
    table.style.visibility = 'visible';
    winText.remove();
    winKing.remove();
    clearBoard();
    initBoard();
    figuresListeners();
});

(() => {
    bInit();
    initBoard();
    figuresListeners();
})();