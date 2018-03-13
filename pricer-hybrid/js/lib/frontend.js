
'use strict';

import Handsontable from 'handsontable';
//import store from '../../../store';
import { isInKeys, isValid } from './util';




var methods = {


	// BUILD METHODS ////////////////////////////////////////////////////////////////////////

	buildOptions: function () {
		let options = this.config.tableConfig;
		options.cell = this.frontend.tools.buildCellRenderers();

		let storedData = this.frontend.tools.getTableDataStoredInBrowser();
		if (storedData !== null) {
			console.log('data from storage');
			options.data = storedData;
			// resize to fit stored data
			options.startRows = options.data.length;
			options.startCols = options.data[0].length;
		}
		else {
			console.log('data from init');
			options.data = this.frontend.tools.buildDataGrid();
		}

		this.frontend.options = options;
	},

	buildCellRenderers: function () {
		let arr = [];

		for (let name in this.block) {
			let block = this.block[name];
			if (block.renderer) {
				for (let r = block.posLo[0]; r <= block.posHi[0]; r++) {
					for (let c = block.posLo[1]; c <= block.posHi[1]; c++) {
						arr.push({ row: r, col: c, renderer: block.renderer });
						window.eee = block;
					}
				}
			}
		}
		return arr;
	},

	buildDataGrid: function () {
		let arr = this.frontend.tools.buildEmptyDataGrid();
		window.tt = this.block;

		for (var name in this.block) {
			let block = this.block[name];
			let r0 = block.posLo[0];
			let c0 = block.posLo[1];
			for (var r = 0; r < block.shape[0]; r++) {
				for (var c = 0; c < block.shape[1]; c++) {
					var row = r0 + r;
					var col = c0 + c;
					arr[row][col] = block.data.value[r][c];
				}
			}
		}
		return arr;
	},


	buildEmptyDataGrid: function () {
		let tableConfig = this.config.tableConfig;
		let arr = new Array(tableConfig.startRows);
		for (let r = 0; r < arr.length; r++) {
			arr[r] = new Array(tableConfig.startCols);
		}
		return arr;
	},


	buildHansontable: function () {
		// console.log('1');
		// this.frontend.options.cells = undefined;
		window.Handsontable = Handsontable;
		let hot = new Handsontable(this.config.el, this.frontend.options);
		// console.log('2');

		hot.addHook('afterChange', (change, source) => {
			let key = 'data-' + this.config.name;
			// restore table after reload of a page
			if (source === "loadData") { }
			else { localStorage[key] = JSON.stringify(hot.getData()); }
		});
		// console.log('3');

		for (let e of this.frontend.hooks) {
			// console.log(e.hook);
			// console.log(e.callback.name);
			hot.addHook(e.hook, e.callback);
			let params = e.defaultParams || [];
			// console.log(params);
			hot.runHooks(e.hook, ...params);

		}
		// console.log('4');

		hot.render();
		this.frontend.object = hot;
	},


	setFrontendObjectinBlocks: function () {
		for (let name in this.block) {
			this.block[name].frontend.object = this.frontend.object;
		}
	},

	// STORE METHODS ////////////////////////////////////////////////////////////////////////

	storeTableDataInBrowser: function () {
		var arr = this.frontend.io.readAllCells();
		store.dispatch('snapshotData', { name: this.config.name, data: arr });
	},

	getTableDataStoredInBrowser: function () {
		// store prevails over localStorage
		if (store.getters.tableData !== undefined) {
			if (isInKeys(store.getters.tableData, this.config.name)) {
				console.log('data loaded from store');
				return store.getters.tableData[this.config.name];
			}
		}
		let key = 'data-' + this.config.name;
		if (localStorage[key] !== undefined) {
			console.log('data loaded from local storage');
			return JSON.parse(localStorage[key]);
		}
		return null;
	},

	clearCache: function () {
		var key = 'data-' + this.config.name;
		delete localStorage[key];
	},


	// IO METHODS ////////////////////////////////////////////////////////////////////////

	readHandsontableCell: function (row, col) {
		return this.frontend.object.getDataAtCell(row, col);
	},

	readHandsontableAllCells: function () {
		return this.frontend.object.getData();
	},

	writeHandsontableCells: function (arrRowColValue) {
		// array of [row, col, value]    
		return this.frontend.object.setDataAtCell(arrRowColValue);
	},



	// HOOK METHODS ////////////////////////////////////////////////////////////////////////
	// REF TO THIS (SHEET) DOES NOT WORK ///////////////////////////////////////////////////
	// SO DIRECT REF TO HANDSONTABLE ///////////////////////////////////////////////////////

	getBlockValidValues: function (arrBlockName, lookup, hot) {
		// console.log('in getBlockValidValues');
		let values = [];

		for (let name of arrBlockName) {
			if (isInKeys(lookup, name)) {
				let posLo = lookup[name].posLo;
				let posHi = lookup[name].posHi;
				for (let r = posLo[0]; r <= posHi[0]; r++) {
					for (let c = posLo[1]; c <= posHi[1]; c++) {
						let value = hot.getDataAtCell(r, c);
						if (isValid(value)) {
							values.push(value);
						}
					}
				}

			}
		}
		return values;
	},


	triggerCallback: function (changes, arrBlockName, lookup) {
		// console.log('in triggerCallback');
		// console.log(changes);

		if (changes === undefined) {
			return true;
		}
		else {
			var row = changes[0];
			var col = changes[1];
			if ((row === undefined) || (col === undefined)) {
				return true;
			}
			for (var name of arrBlockName) {
				if (isInKeys(lookup, name)) {
					let posLo = lookup[name].posLo;
					let posHi = lookup[name].posHi;
					if (((row <= posHi[0]) && (row >= posLo[0])) && ((col <= posHi[1]) && (col >= posLo[1]))) {
						return true;
					}
				}
			}
			return false;

		}
	},

	emptyPosValue: function (arrBlockName, lookup) {
		// console.log('in emptyPosValue');
		let values = [];

		for (let name of arrBlockName) {
			if (isInKeys(lookup, name)) {
				let posLo = lookup[name].posLo;
				let posHi = lookup[name].posHi;
				for (let r = posLo[0]; r <= posHi[0]; r++) {
					for (let c = posLo[1]; c <= posHi[1]; c++) {
						values.push([r, c, null]);
					}
				}

			}
		}
		return values;
	},

};

export { methods as default };

