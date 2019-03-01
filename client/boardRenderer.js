const lodash = require('lodash');

const render = (board) => {
    // clear the console
    console.log('\033c');
    for (let downIndex = 0; downIndex < 6; downIndex++) {
        let rowDisplay = '';
        for (let acrossIndex = 0; acrossIndex < 9; acrossIndex++) {

            const value = board[`${acrossIndex}`][downIndex];
            if (lodash.isEmpty(value)) {
                rowDisplay += '[ ] ';
            } else {
                rowDisplay += `[${value}] `;
            }
        }
        console.log(rowDisplay);
    }
    console.log('-----------------------------------');
    console.log('[1] [2] [3] [4] [5] [6] [7] [8] [9]');
};

exports.boardRenderer = {
    render
};