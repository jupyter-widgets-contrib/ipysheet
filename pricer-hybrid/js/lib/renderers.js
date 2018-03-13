import style from './style';
import tools from './tools';
var _ = require('underscore');

import { lookup } from './config';
var Handsontable = require('handsontable')

var commonRenderers = {
	HeaderRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		cellProperties.readOnly = true;
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		td.style.backgroundColor = style.label.header.bgColor;
		td.style.color = style.label.header.fontColor;
		td.style.fontSize = style.label.header.fontWeight;
	},

	LabelRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		cellProperties.readOnly = true;
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		td.style.backgroundColor = style.label.standard.bgColor;
		td.style.color = style.label.standard.fontColor;
		td.style.fontSize = style.label.standard.fontWeight;
	},

	MyDateRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DateRenderer.apply(this, arguments);
		cellProperties.type = 'date';
		cellProperties.dateFormat = 'YYYY-MM-DD';
		//cellProperties.correctFormat = true;
		//cellProperties.defaultDate = '2017-01-01';
		cellProperties.allowEmpty = true;
		cellProperties.datePickerConfig = {
			// First day of the week (0: Sunday, 1: Monday, etc)
			firstDay: 1,
			showWeekNumber: false,
			numberOfMonths: 1,
			disableDayFn: function (date) {
				// Disable Sunday and Saturday
				return date.getDay() === 0 || date.getDay() === 6;
			}
		};
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.inputDate.filled.bgColor;
			td.style.color = style.inputDate.filled.fontColor;
			td.style.fontSize = style.inputDate.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.inputDate.blank.bgColor;
			td.style.color = style.inputDate.blank.fontColor;
			td.style.fontSize = style.inputDate.blank.fontWeight;
		}
	},

	DropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.AutocompleteRenderer.apply(this, arguments);
		cellProperties.type = 'dropdown';
		// cellProperties.source = [TBD];
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.inputDropdown.filled.bgColor;
			td.style.color = style.inputDropdown.filled.fontColor;
			td.style.fontSize = style.inputDropdown.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.inputDropdown.blank.bgColor;
			td.style.color = style.inputDropdown.blank.fontColor;
			td.style.fontSize = style.inputDropdown.blank.fontWeight;
		}
	},

	InputTextRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.inputStandard.filled.bgColor;
			td.style.color = style.inputStandard.filled.fontColor;
			td.style.fontSize = style.inputStandard.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.inputStandard.blank.bgColor;
			td.style.color = style.inputStandard.blank.fontColor;
			td.style.fontSize = style.inputStandard.blank.fontWeight;
		}
	},

	InputNumericRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.NumericRenderer.apply(this, arguments);
		cellProperties.type = 'numeric';
		cellProperties.format = '0,0.[00000]';
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.inputStandard.filled.bgColor;
			td.style.color = style.inputStandard.filled.fontColor;
			td.style.fontSize = style.inputStandard.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.inputStandard.blank.bgColor;
			td.style.color = style.inputStandard.blank.fontColor;
			td.style.fontSize = style.inputStandard.blank.fontWeight;
		}
	},

	InputBooleanRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
		cellProperties.type = 'checkbox';
		td.style.backgroundColor = style.label.standard.bgColor;
	},

	OutputTextRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.output.filled.bgColor;
			td.style.color = style.output.filled.fontColor;
			td.style.fontSize = style.output.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.output.blank.bgColor;
			td.style.color = style.output.blank.fontColor;
			td.style.fontSize = style.output.blank.fontWeight;
		}
	},

	OutputNumericRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.NumericRenderer.apply(this, arguments);
		cellProperties.type = 'numeric';
		cellProperties.format = '0,0.[00000]';
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.output.filled.bgColor;
			td.style.color = style.output.filled.fontColor;
			td.style.fontSize = style.output.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.output.blank.bgColor;
			td.style.color = style.output.blank.fontColor;
			td.style.fontSize = style.output.blank.fontWeight;
		}
	},



	OutPutSignedNumericRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.NumericRenderer.apply(this, arguments);

		Handsontable.renderers.NumericRenderer.apply(this, arguments);
		cellProperties.type = 'numeric';
		cellProperties.format = '0,0.[00000]';
		if (tools.isValid(value)) {
			td.style.backgroundColor = style.inputStandard.filled.bgColor;
			td.style.color = style.inputStandard.filled.fontColor;
			td.style.fontSize = style.inputStandard.filled.fontWeight;
		}
		else {
			td.style.backgroundColor = style.inputStandard.blank.bgColor;
			td.style.color = style.inputStandard.blank.fontColor;
			td.style.fontSize = style.inputStandard.blank.fontWeight;
		}
		if (value > 0) {
			td.style.color = style.inputStandard.blank.fontColor;
		}
		else {
			td.style.color = style.inputStandard.blank.fontColorNegative;
		}
	}
}

Handsontable.renderers.registerRenderer('Header', commonRenderers.HeaderRenderer);
Handsontable.renderers.registerRenderer('Label', commonRenderers.LabelRenderer);
Handsontable.renderers.registerRenderer('Date', commonRenderers.MyDateRenderer);
Handsontable.renderers.registerRenderer('Dropdown', commonRenderers.DropdownRenderer);
Handsontable.renderers.registerRenderer('InputText', commonRenderers.InputTextRenderer);
Handsontable.renderers.registerRenderer('InputNumeric', commonRenderers.InputNumericRenderer);
Handsontable.renderers.registerRenderer('InputBoolean', commonRenderers.InputBooleanRenderer);
Handsontable.renderers.registerRenderer('OutputText', commonRenderers.OutputTextRenderer);
Handsontable.renderers.registerRenderer('OutputNumeric', commonRenderers.OutputNumericRenderer);
Handsontable.renderers.registerRenderer('OutputSignedNumeric', commonRenderers.OutputSignedNumericRenderer);

Handsontable.renderers.registerRenderer('common.Header', commonRenderers.HeaderRenderer);
Handsontable.renderers.registerRenderer('common.Label', commonRenderers.LabelRenderer);
Handsontable.renderers.registerRenderer('common.Date', commonRenderers.MyDateRenderer);
Handsontable.renderers.registerRenderer('common.Dropdown', commonRenderers.DropdownRenderer);
Handsontable.renderers.registerRenderer('common.InputText', commonRenderers.InputTextRenderer);
Handsontable.renderers.registerRenderer('common.InputNumeric', commonRenderers.InputNumericRenderer);
Handsontable.renderers.registerRenderer('common.InputBoolean', commonRenderers.InputBooleanRenderer);
Handsontable.renderers.registerRenderer('common.OutputText', commonRenderers.OutputTextRenderer);
Handsontable.renderers.registerRenderer('common.OutputNumeric', commonRenderers.OutputNumericRenderer);
Handsontable.renderers.registerRenderer('common.OutputSignedNumeric', commonRenderers.OutputSignedNumericRenderer);

_.each(commonRenderers, (value, key) => {
	let name = key.substr(0, key.length-8);
	console.log('adding renderer', name, key);
	Handsontable.renderers.registerRenderer(name, value);
	Handsontable.renderers.registerRenderer(key, value);
	Handsontable.renderers[name] = value
	Handsontable.renderers[key] = value
	Handsontable.renderers.registerRenderer('common.' + name, value);
	Handsontable.renderers.registerRenderer('common.' + key, value);
})



const posCalendarMode = lookup['CalendarMode'].posLo;



var renderers = {

	ProductDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['Contingency', 'Worst Of'];
	},

	CalendarDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['Unique', 'Multiple'];
	},

	MarxModeDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['LastMarket', 'AutoRefresh'];
	},

	OptionsDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['Call', 'Put', 'CallSpread', 'PutSpread', 'Digit'];
	},

	BasketTypeDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['Weighted', 'Worst of', 'Best of'];
	},

	UnderlyingTypeDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['Underlying', 'Forex', 'Swap Rate'];
	},

	IsPercentageDropdownRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.DropdownRenderer.apply(this, arguments);
		cellProperties.source = ['in %', 'in ccy'];
	},

	// WeightRenderer: function (instance, td, row, col, prop, value, cellProperties) {
	// 	Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
	// 	var stock = instance.getDataAtCell(row, col + 1);
	// 	if (!tools.isValid(stock)) {
	// 		td.style.backgroundColor = '#C6DEFF';
	// 	}
	// },

	FutExpisRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.MyDateRenderer.apply(this, arguments);
		var stock = instance.getDataAtCell(row, col - 1);
		if (!tools.isValid(stock)) {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		} else {
			cellProperties.readOnly = false;
			Handsontable.renderers.MyDateRenderer.apply(this, arguments);
		}
	},

	FutRefsRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		var stock = instance.getDataAtCell(row, col - 2);
		if (!tools.isValid(stock)) {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		} else {
			cellProperties.readOnly = false;
			Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		}
	},

	CashRefsRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		var stock = instance.getDataAtCell(row, col - 3);
		if (!tools.isValid(stock)) {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		} else {
			cellProperties.readOnly = false;
			Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		}
	},



	/////// based on option typ cell *spread or not
	LabelSecondStrikeRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		var option = instance.getDataAtCell(row - 3, col);

		if (option.indexOf('Spread') != -1) {
			Handsontable.renderers.LabelRenderer.apply(this, arguments);
		} else {
			td.style.color = style.label.standard.bgColor;
		}
	},

	SecondStrikeRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		var option = instance.getDataAtCell(row - 3, col - 1);

		if (option.indexOf('Spread') != -1) {
			cellProperties.readOnly = false;
			Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		} else {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		}
	},




	/////// based on calendat type: multiple or not
	LabelBasketDatesRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		if (instance.getDataAtCell(...posCalendarMode) == 'Multiple') {
			Handsontable.renderers.LabelRenderer.apply(this, arguments);
		} else {
			td.style.color = style.label.standard.bgColor;
		}
	},


	BasketDatesRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.MyDateRenderer.apply(this, arguments);
		if (instance.getDataAtCell(...posCalendarMode) == 'Multiple') {
			cellProperties.readOnly = false;
			Handsontable.renderers.MyDateRenderer.apply(this, arguments);
		} else {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		}
	},



	CorrelRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		var stock = instance.getDataAtCell(row, col - 1);
		if (!tools.isValid(stock)) {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		} else {
			cellProperties.readOnly = false;
			Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		}
	},

	DeformerRenderer: function (instance, td, row, col, prop, value, cellProperties) {
		Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		var stock = instance.getDataAtCell(row, 9);
		if (!tools.isValid(stock)) {
			cellProperties.readOnly = true;
			td.style.color = style.label.standard.bgColor;
			td.style.backgroundColor = style.label.standard.bgColor;
		} else {
			cellProperties.readOnly = false;
			Handsontable.renderers.InputNumericRenderer.apply(this, arguments);
		}
	},
}

_.each(renderers, (value, key) => {
	let name = key.substr(0, key.length-8);
	console.log('adding renderer', name, key);
	Handsontable.renderers.registerRenderer(name, value);
	Handsontable.renderers.registerRenderer('specific.'+key, value);
})



