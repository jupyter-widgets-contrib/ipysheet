
'use strict';

import frontend from './frontend';
import { lookup } from './config';
import { isValid } from './util';


var displayCorrelStocks = function (changes, source) {

	if (source === 'loadData') {
		return;
	}

	if (frontend.triggerCallback(changes, ['tickers1', 'tickers2'], lookup)) {
		// console.log('inside triggerCallback');

		var stocks = frontend.getBlockValidValues(['tickers1', 'tickers2'], lookup, this);

		var r, c;
		var correlCells = [];
		[r, c] = lookup['CorrelStock'].posLo;
		for (let i = 0; i < stocks.length; i++) {
			for (let j = i + 1; j < stocks.length; j++) {
				correlCells.push([r, c, stocks[i]]);
				correlCells.push([r, c + 1, stocks[j]]);
				r++;
			}
		}
		let finalRow = r;

		// IMPORTANT --- add emptyCells to clear whichever cells are not filled - ORDER IS IMPORTANT
		// let emptyCells = frontend.getAllBlockCellsToClear(['CorrelStock', 'CorrelValue'], lookup, this);
		let emptyCells = frontend.emptyPosValue(['CorrelStock', 'CorrelValue'], lookup);
		correlCells = [...correlCells, ...emptyCells];

		this.setDataAtCell(correlCells);

		// manage number of unused cells at bottom of sheet
		let hotNbRows = this.getData().length || 0;
		let lastRow = Math.max(30, finalRow);
		if (hotNbRows - lastRow > 0) {
			this.alter('remove_row', lastRow, hotNbRows - lastRow - 1);
			this.render()
		}
	}

};


var displayDeformerStocks = function (changes, source) {

	if (source === 'loadData') {
		return;
	}

	if (frontend.triggerCallback(changes, ['tickers1', 'tickers2'], lookup)) {
		// console.log('inside triggerCallback');

		let stocks = frontend.getBlockValidValues(['tickers1', 'tickers2'], lookup, this);

		let r, c;
		let deformerCells = [];
		[r, c] = lookup['DeformerStock'].posLo;
		for (let i = 0; i < stocks.length; i++) {
			deformerCells.push([r, c, stocks[i]]);
			deformerCells.push([r, c + 1, 0]);
			deformerCells.push([r, c + 2, 0]);
			deformerCells.push([r, c + 3, 1]);
			deformerCells.push([r, c + 4, 1]);
			r = r + 1;
		}

		let emptyCells = frontend.emptyPosValue(['DeformerStock', 'VolDeformer', 'RepoDeformer', 'DivDeformer', 'SmileDeformer'], lookup);
		// IMPORTANT --- add emptyCells to clear whichever cells are not filled - ORDER IS IMPORTANT
		deformerCells = [...deformerCells, ...emptyCells];

		this.setDataAtCell(deformerCells);

	}

};


var displayDefaultWeights = function (changes, source) {

	if (source === 'loadData') {
		return;
	}

	if (frontend.triggerCallback(changes, ['tickers1', 'tickers2'], lookup)) {
		// console.log('inside triggerCallback');

		let r, c, r2, c2;
		let defaultWeightCells = [];
		for (let nameWeight of ['weights1', 'weights2']) {
			[r, c] = lookup[nameWeight].posLo;
			[r2, c2] = lookup[nameWeight].posHi;
			let shape = [r2 - r + 1, c2 - c + 1];

			for (let i = 0; i < shape[0]; i++) {
				let stock = this.getDataAtCell(r + i, c + 1);
				let weight = this.getDataAtCell(r + i, c);
				if (isValid(stock)) {
					defaultWeightCells.push([r + i, c, 1]);
				}
			}
		}

		let emptyCells = frontend.emptyPosValue(['weights1', 'weights2'], lookup);
		// IMPORTANT --- add emptyCells to clear whichever cells are not filled - ORDER IS IMPORTANT
		defaultWeightCells = [...defaultWeightCells, ...emptyCells];

		this.setDataAtCell(defaultWeightCells);
	}

};



var updateStrikeMatDates = function (changes, source) {

	if (source === 'loadData') {
		return;
	}

	if (frontend.triggerCallback(changes, ['CalendarMode'], lookup)) {
		// console.log('inside triggerCallback');

		var r, c, value, strikeDate, matDate;

		[r, c] = lookup['CalendarMode'].posLo;
		value = this.getDataAtCell(r, c);
		[r, c] = lookup['StrikeDate'].posLo;
		strikeDate = this.getDataAtCell(r, c);
		[r, c] = lookup['MaturityDate'].posLo;
		matDate = this.getDataAtCell(r, c);

		var cells = [];
		if (value == 'Multiple') {
			[r, c] = lookup['StrikeDate1'].posLo;
			cells.push([r, c, strikeDate]);
			[r, c] = lookup['StrikeDate2'].posLo;
			cells.push([r, c, strikeDate]);

			[r, c] = lookup['MaturityDate1'].posLo;
			cells.push([r, c, matDate]);
			[r, c] = lookup['MaturityDate2'].posLo;
			cells.push([r, c, matDate]);
		}
		this.setDataAtCell(cells);
	}

};




export default [
	{
		hook: 'afterChange',
		callback: displayCorrelStocks,
		defaultParams: [[undefined], 'init'] // [source, changes]
	},
	{
		hook: 'afterChange',
		callback: displayDeformerStocks,
		defaultParams: [[undefined], 'init'] // [source, changes]
	},
	{
		hook: 'afterChange',
		callback: displayDefaultWeights,
		defaultParams: [[undefined], 'init'] // [source, changes]
	},
	{
		hook: 'afterChange',
		callback: updateStrikeMatDates,
		defaultParams: [[undefined], 'init'] // [source, changes]
	},
];
