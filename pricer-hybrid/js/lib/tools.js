
'use strict';

//import { isInKeys, isValid } from '../../../js/util';


var methods = {


	// BUILD METHODS ////////////////////////////////////////////////////////////////////////

	buildLookup: function (blockConfig) {
		let lookup = {};
		for (let block of blockConfig) {
			if (block.name) {
				lookup[block.name] = { 'posLo': block.posLo || block.pos, 'posHi': block.posHi || block.pos };
			}
		}
		// console.log('lookup');
		// console.log(lookup);
		return lookup;
	},

	fromRendererStringToObject: function (blockConfig, specificRenderers, commonRenderers) {
		let blockConfig2 = [];
		for (let block of blockConfig) {
			var block2 = Object.assign({}, block);
			if (isInKeys(block2, 'renderer')) {
				if (block2.renderer.startsWith('common.')) {
					let renderer = block2.renderer.split('.')[1];
					block2.renderer = commonRenderers[renderer];
				}
				else if (block2.renderer.startsWith('specific.')) {
					let renderer = block2.renderer.split('.')[1];
					block2.renderer = specificRenderers[renderer];
				}
			}
			blockConfig2.push(block2);
		}
		return blockConfig2;
	},


	renameBlockConfig: function () {
		let blockConfig2 = [];
		let c = 0;
		for (var block of this.config.blockConfig) {
			var block2 = Object.assign({}, block);
			// console.log(block2);
			if (!isInKeys(block2, 'name')) {
				// console.log('1 loop');
				// console.log(block2.name);
				block2.name = '_noName_' + c;
				// console.log(block2.name);
				c = c + 1;
			}
			blockConfig2.push(block2);
		}
		this.config.blockConfigRaw = this.config.blockConfig;
		this.config.blockConfig = blockConfig2;

	},


	// LIST METHODS ////////////////////////////////////////////////////////////////////////

	listBlockName: function () {
		let arr = Object.keys(this.block);
		return arr;
	},

	listNamedBlockName: function () {
		let arr = Object.keys(this.block).filter(e => !(e.startsWith('_noName_')));
		return arr;
	},

	isBlockName: function (name) {
		let arr = this.tools.misc.listBlockName();
		return isInKeys(arr, name);
	},



	// VALID METHODS ////////////////////////////////////////////////////////////////////////

	isValid: function (value) {
		return !((value === '') || (value === undefined) || (value === null));

	},



};


export { methods as default };




