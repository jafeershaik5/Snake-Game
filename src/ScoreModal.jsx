import React from 'react';

const ScoreModal = ({ show, onClose, score }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <dialog open className='scorecard-modal'>
                <div className="scores">
                    <h2> Your Score : <span>{score}</span></h2>
                    <br />
                    <h2>😎</h2>
                </div>
                <button className="close-btn" onClick={onClose}>X</button>
                <button className="playagain btn" onClick={onClose}>Play Again</button>
            </dialog>
        </div>
    );
};

export default ScoreModal;