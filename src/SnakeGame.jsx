import React, { useEffect, useState, useRef } from "react";
import ScoreModal from './ScoreModal'; // Import the ScoreModal component


const GRIDSIZE = 30;
const GAMEGRID = Array.from({ length: GRIDSIZE }, () => {
    return new Array(GRIDSIZE).fill('')
});
const generateFood = () => {
    const x = Math.floor(Math.random() * GRIDSIZE);
    const y = Math.floor(Math.random() * GRIDSIZE);
    return [x, y];
};
const initialSize = [[5, 15]];

function SnakeGame() {
    const [snakeBody, setSnakeBody] = useState(initialSize);
    const directionRef = useRef([1, 0]);
    const foodRef = useRef(generateFood());
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const intervalRef = useRef(null);

    const isSnakeBodyDiv = (xc, yc) => {
        return snakeBody.some(([x, y]) => {
            return x === xc && y === yc;
        });
    };

    useEffect(() => {
        if (isRunning && !isModalOpen) {
            intervalRef.current = setInterval(() => {
                setSnakeBody((prevSnakeBody) => {
                    const newHead = [
                        prevSnakeBody[0][0] + directionRef.current[0],
                        prevSnakeBody[0][1] + directionRef.current[1]
                    ];
                    if (
                        newHead[0] < 0 ||
                        newHead[0] >= GRIDSIZE ||
                        newHead[1] < 0 ||
                        newHead[1] >= GRIDSIZE ||
                        prevSnakeBody.some(([x, y]) => newHead[0] === x && newHead[1] === y)
                    ) {
                        directionRef.current = [1, 0];
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setIsModalOpen(true); // Open the modal when the game is lost
                        return initialSize;
                    }
                    const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);
                    if (
                        newHead[0] === foodRef.current[0] &&
                        newHead[1] === foodRef.current[1]
                    ) {
                        setScore(prevScore => prevScore + 1);
                        foodRef.current = generateFood();
                    } else {
                        copySnakeBody.pop();
                    }
                    copySnakeBody.unshift(newHead);
                    return copySnakeBody;
                });
            }, 100);
        }

        const handleDirection = (e) => {
            if (!isModalOpen) {
                const key = e.key;
                if ((key === "ArrowUp" || key === 'w') && directionRef.current[1] !== 1) {
                    directionRef.current = [0, -1];
                } else if ((key === "ArrowLeft" || key === 'a') && directionRef.current[0] !== 1) {
                    directionRef.current = [-1, 0];
                } else if ((key === "ArrowRight" || key === 'd') && directionRef.current[0] !== -1) {
                    directionRef.current = [1, 0];
                } else if ((key === "ArrowDown" || key === 's') && directionRef.current[1] !== -1) {
                    directionRef.current = [0, 1];
                }
            }
        };
        const startGameOnKeyPress = (e) => {
            if (!isRunning && !isModalOpen) {
                setIsRunning(true);
            }
        };
        const PauseGameOnSpaceBar = (e) => {
            const key = e.key;
            if (isRunning && key == ' ') {
                setIsRunning(false)
            }
        }
        window.addEventListener('keydown', handleDirection);
        window.addEventListener('keydown', startGameOnKeyPress);
        window.addEventListener('keydown', PauseGameOnSpaceBar);
        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('keydown', handleDirection);
            window.removeEventListener('keydown', startGameOnKeyPress);
            window.removeEventListener('keydown', PauseGameOnSpaceBar);


        };
    }, [isRunning, isModalOpen]);

    const closeModal = () => {
        setIsModalOpen(false);
        setScore(0);
        setSnakeBody(initialSize);
    };

    return (
        <>
            <div className={`container ${isModalOpen ? 'blurred' : ''}`}>
                <div className="count"><h1>Score : {score}</h1></div>
                <div className="game-container">
                    {GAMEGRID.map((row, yc) => {
                        return row.map((cell, xc) => {
                            return <div className={`cell ${isSnakeBodyDiv(xc, yc) ? 'snake' : ''} ${foodRef.current[0] === xc && foodRef.current[1] === yc ? 'food' : ''}`} key={`${xc}-${yc}`}></div>;
                        });
                    })}
                </div>
                <div className="btns">
                    <button className="btn" onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button>
                </div>
            </div>
            <ScoreModal show={isModalOpen} onClose={closeModal} score={score} />
        </>
    );
}

export default SnakeGame;