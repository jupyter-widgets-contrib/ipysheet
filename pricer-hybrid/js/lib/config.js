import { dateString } from './util';
import tools  from './tools';

var tableConfig = {
	startRows: 6 + 7 + 11 + 1 + 45,
	maxRows: 6 + 7 + 11 + 1 + 6 + 45,
	startCols: 14,
	maxCols: 14,
	rowHeaders: false,
	colHeaders: false,
	className: 'htCenter htMiddle',
	manualColumnResize: true,
	colWidths: [120, 120, 10, 90, 100, 100, 100, 90, 10, 120, 100, 100, 100, 90],

	mergeCells: [
		{ row: 0, col: 0, rowspan: 1, colspan: 2 },
		{ row: 0, col: 3, rowspan: 1, colspan: 2 },
		{ row: 0, col: 6, rowspan: 1, colspan: 2 },
		{ row: 2, col: 5, rowspan: 2, colspan: 1 },
		{ row: 0, col: 3 + 6, rowspan: 1, colspan: 2 },
		{ row: 0, col: 6 + 6, rowspan: 1, colspan: 2 },
		{ row: 2, col: 5 + 6, rowspan: 2, colspan: 1 },
	]
};


var blockConfig = [

	// Product Information
	{
		pos: [0, 0],
		renderer: 'common.HeaderRenderer',
		init: 'Product Information'
	},
	{
		posLo: [1, 0],
		posHi: [7, 0],
		renderer: 'common.LabelRenderer',
		init: [['Strike Date'], ['Maturity Date'],
		['Currency'], ['Notional (Mio)'], ['Product'], ['Calendar Type'],
		['Pricing Mode'], ['MarxMarket']]
	},
	{
		pos: [1, 1],
		renderer: 'common.MyDateRenderer',
		init: new dateString('today').string, //today
		name: 'StrikeDate'
	},
	{
		pos: [2, 1],
		renderer: 'common.MyDateRenderer',
		init: new dateString('today').addYear(1), //today + 1y
		name: 'MaturityDate'
	},
	{
		pos: [3, 1],
		renderer: 'common.InputTextRenderer',
		init: 'EUR',
		name: 'Currency'
	},
	{
		pos: [4, 1],
		renderer: 'common.InputNumericRenderer',
		init: 0.0,
		name: 'Notional'
	},
	{
		pos: [5, 1],
		renderer: 'specific.ProductDropdownRenderer',
		init: 'Contingency',
		name: 'ProductType'
	},
	{
		pos: [6, 1],
		renderer: 'specific.CalendarDropdownRenderer',
		init: 'Unique',
		name: 'CalendarMode'
	},
	{
		pos: [7, 1],
		renderer: 'specific.MarxModeDropdownRenderer',
		init: 'LastMarket',
		name: 'MarxMode'
	},

	// Basket 1
	{
		posLo: [0, 3],
		posHi: [6, 7],
		renderer: 'common.LabelRenderer',
	},
	{
		pos: [0, 3],
		renderer: 'specific.OptionsDropdownRenderer',
		init: 'Call',
		name: 'OptionType1'
	},
	{
		pos: [0, 5],
		renderer: 'specific.BasketTypeDropdownRenderer',
		init: 'Weighted',
		name: 'BasketType1'
	},
	{
		pos: [0, 6],
		renderer: 'specific.UnderlyingTypeDropdownRenderer',
		init: 'Underlying',
		name: 'UnderlyingType1'
	},
	{
		pos: [1, 3],
		renderer: 'specific.LabelBasketDatesRenderer',
		init: 'From'
	},
	{
		pos: [1, 4],
		renderer: 'specific.BasketDatesRenderer',
		// init: '01/01/2017',
		name: 'StrikeDate1'
	},
	{
		pos: [1, 5],
		renderer: 'specific.LabelBasketDatesRenderer',
		init: 'To'
	},
	{
		pos: [1, 6],
		renderer: 'specific.BasketDatesRenderer',
		// init: '01/01/2018',
		name: 'MaturityDate1'
	},
	// {
	// 	posLo: [2, 3],
	// 	posHi: [6, 3],
	// 	renderer: 'common.LabelRenderer',
	// 	init: [['Strike'], ['Strike 2'], ['Lever'], ['Gap Min (%)'], ['Delta Max']]
	// },
	{
		posLo: [2, 3],
		posHi: [2, 3],
		renderer: 'common.LabelRenderer',
		init: [['Strike']]
	},
	{
		posLo: [3, 3],
		posHi: [3, 3],
		renderer: 'specific.LabelSecondStrikeRenderer',
		init: [['Strike 2']]
	},
	{
		posLo: [4, 3],
		posHi: [6, 3],
		renderer: 'common.LabelRenderer',
		init: [['Lever'], ['Gap Min (%)'], ['Delta Max']]
	},
	{
		pos: [2, 4],
		renderer: 'common.InputNumericRenderer',
		init: 100,
		name: 'K_Option1'
	},
	{
		pos: [3, 4],
		renderer: 'specific.SecondStrikeRenderer',
		init: 0,
		name: 'K_Option12'
	},
	{
		pos: [4, 4],
		renderer: 'common.InputNumericRenderer',
		init: 1,
		name: 'Lever1'
	},
	{
		pos: [5, 4],
		renderer: 'common.InputNumericRenderer',
		init: 0,
		name: 'GapFloors1'
	},
	{
		pos: [6, 4],
		renderer: 'common.InputNumericRenderer',
		init: 1000,
		name: 'DeltaMaxRefs1'
	},
	{
		pos: [2, 5],
		renderer: 'specific.IsPercentageDropdownRenderer',
		init: 'in %',
		name: 'IsPercentageK1'
	},
	{
		posLo: [4, 5],
		posHi: [6, 5],
		renderer: 'common.LabelRenderer',
		init: [['Time(s)'], ['Rectangular'], ['mEUR']]
	},
	{
		pos: [2, 6],
		renderer: 'common.LabelRenderer',
		init: 'IsQtoFX'
	},
	{
		pos: [2, 7],
		renderer: 'common.InputBooleanRenderer',
		init: false,
		name: 'IsQtoFX1'
	},
	{
		pos: [5, 6],
		renderer: 'common.LabelRenderer',
		init: 'Gap Tessa'
	},
	{
		pos: [5, 7],
		renderer: 'common.InputBooleanRenderer',
		init: false,
		name: 'GapTessa1'
	},
	{
		pos: [8, 3],
		renderer: 'common.LabelRenderer',
		init: 'Weights'
	},
	{
		pos: [8, 4],
		renderer: 'common.LabelRenderer',
		init: 'Underlyings'
	},
	{
		pos: [8, 5],
		renderer: 'common.LabelRenderer',
		init: 'Fut Expi'
	},
	{
		pos: [8, 6],
		renderer: 'common.LabelRenderer',
		init: 'Fut Ref'
	},
	{
		pos: [8, 7],
		renderer: 'common.LabelRenderer',
		init: 'Cash Ref'
	},
	{
		posLo: [9, 3],
		posHi: [9 + 4, 3],
		renderer: 'common.InputNumericRenderer',
		name: 'weights1'
	},
	{
		posLo: [9, 4],
		posHi: [9 + 4, 4],
		renderer: 'common.InputTextRenderer',
		// init: [['SX5E'], ['SPX'], [], [], [], []],
		init: [['SX5E', 'SPXX', '', '', '']],
		transpose: true,
		trimRow: true,
		name: 'tickers1'
	},
	{
		posLo: [9, 5],
		posHi: [9 + 4, 5],
		renderer: 'specific.FutExpisRenderer',
		init: [[], [], [], [], [], []],
		name: 'fut_expis1'
	},
	{
		posLo: [9, 6],
		posHi: [9 + 4, 6],
		renderer: 'specific.FutRefsRenderer',
		init: [[], [], [], [], [], []],
		name: 'fut_refs1'
	},
	{
		posLo: [9, 7],
		posHi: [9 + 4, 7],
		renderer: 'specific.CashRefsRenderer',
		init: [[], [], [], [], [], []],
		name: 'cash_refs1'
	},

	// Basket 2
	{
		posLo: [0, 3 + 6],
		posHi: [6, 7 + 6],
		renderer: 'common.LabelRenderer',
	},
	{
		pos: [0, 3 + 6],
		renderer: 'specific.OptionsDropdownRenderer',
		init: 'Call',
		name: 'OptionType2'
	},
	{
		pos: [0, 5 + 6],
		renderer: 'specific.BasketTypeDropdownRenderer',
		init: 'Weighted',
		name: 'BasketType2'
	},
	{
		pos: [0, 6 + 6],
		renderer: 'specific.UnderlyingTypeDropdownRenderer',
		init: 'Underlying',
		name: 'UnderlyingType2'
	},
	{
		pos: [1, 3 + 6],
		renderer: 'specific.LabelBasketDatesRenderer',
		init: 'From'
	},
	{
		pos: [1, 4 + 6],
		renderer: 'specific.BasketDatesRenderer',
		// in it: '01/01/2017',
		name: 'StrikeDate2'
	},
	{
		pos: [1, 5 + 6],
		renderer: 'specific.LabelBasketDatesRenderer',
		init: 'To'
	},
	{
		pos: [1, 6 + 6],
		renderer: 'specific.BasketDatesRenderer',
		// init: '01/01/2018',
		name: 'MaturityDate2'
	},
	// {
	// 	posLo: [2, 3+6],
	// 	posHi: [6, 3+6],
	// 	renderer: 'common.LabelRenderer',
	// 	init: [['Strike'], ['Strike 2'], ['Lever'], ['Gap Min (%)'], ['Delta Max']]
	// },
	{
		posLo: [2, 3 + 6],
		posHi: [2, 3 + 6],
		renderer: 'common.LabelRenderer',
		init: [['Strike']]
	},
	{
		posLo: [3, 3 + 6],
		posHi: [3, 3 + 6],
		renderer: 'specific.LabelSecondStrikeRenderer',
		init: [['Strike 2']]
	},
	{
		posLo: [4, 3 + 6],
		posHi: [6, 3 + 6],
		renderer: 'common.LabelRenderer',
		init: [['Lever'], ['Gap Min (%)'], ['Delta Max']]
	},
	{
		pos: [2, 4 + 6],
		renderer: 'common.InputNumericRenderer',
		init: 100,
		name: 'K_Option2'
	},
	{
		pos: [3, 4 + 6],
		renderer: 'specific.SecondStrikeRenderer',
		init: 0,
		name: 'K_Option22'
	},
	{
		pos: [4, 4 + 6],
		renderer: 'common.InputNumericRenderer',
		init: 1,
		name: 'Lever2'
	},
	{
		pos: [5, 4 + 6],
		renderer: 'common.InputNumericRenderer',
		init: 0,
		name: 'GapFloors2'
	},
	{
		pos: [6, 4 + 6],
		renderer: 'common.InputNumericRenderer',
		init: 1000,
		name: 'DeltaMaxRefs2'
	},
	{
		pos: [2, 5 + 6],
		renderer: 'specific.IsPercentageDropdownRenderer',
		init: 'in %',
		name: 'IsPercentageK2'
	},
	{
		posLo: [4, 5 + 6],
		posHi: [6, 5 + 6],
		renderer: 'common.LabelRenderer',
		init: [['Time(s)'], ['Rectangular'], ['mEUR']]
	},
	{
		pos: [2, 6 + 6],
		renderer: 'common.LabelRenderer',
		init: 'IsQtoFX'
	},
	{
		pos: [2, 7 + 6],
		renderer: 'common.InputBooleanRenderer',
		init: false,
		name: 'IsQtoFX2'
	},
	{
		pos: [5, 6 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Gap Tessa'
	},
	{
		pos: [5, 7 + 6],
		renderer: 'common.InputBooleanRenderer',
		init: false,
		name: 'GapTessa2'
	},
	{
		pos: [8, 3 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Weights'
	},
	{
		pos: [8, 4 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Underlyings'
	},
	{
		pos: [8, 5 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Fut Expi'
	},
	{
		pos: [8, 6 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Fut Ref'
	},
	{
		pos: [8, 7 + 6],
		renderer: 'common.LabelRenderer',
		init: 'Cash Ref'
	},
	{
		posLo: [9, 3 + 6],
		posHi: [9 + 4, 3 + 6],
		renderer: 'common.InputNumericRenderer',
		// init: [[1], [1], [], [], [], []],
		name: 'weights2'
	},
	{
		posLo: [9, 4 + 6],
		posHi: [9 + 4, 4 + 6],
		renderer: 'common.InputTextRenderer',
		init: [['EUR/USD'], [], [], [], [], []],
		name: 'tickers2'
	},
	{
		posLo: [9, 5 + 6],
		posHi: [9 + 4, 5 + 6],
		renderer: 'specific.FutExpisRenderer',
		init: [[], [], [], [], [], []],
		name: 'fut_expis2'
	},
	{
		posLo: [9, 6 + 6],
		posHi: [9 + 4, 6 + 6],
		renderer: 'specific.FutRefsRenderer',
		init: [[], [], [], [], [], []],
		name: 'fut_refs2'
	},
	{
		posLo: [9, 7 + 6],
		posHi: [9 + 4, 7 + 6],
		renderer: 'specific.CashRefsRenderer',
		init: [[], [], [], [], [], []],
		name: 'cash_refs2'
	},

	// Correl
	{
		pos: [15, 3],
		renderer: 'common.LabelRenderer',
		init: 'Correl Basket'
	},
	{
		posLo: [16, 3],
		posHi: [16 + 45, 5],
		renderer: 'common.InputTextRenderer',
		name: 'CorrelStock'
	},
	{
		posLo: [16, 5],
		posHi: [16 + 45, 5],
		renderer: 'specific.CorrelRenderer',
		name: 'CorrelValue'
	},

	// Deformers
	{
		pos: [15, 9],
		renderer: 'common.LabelRenderer',
		init: 'Deformers'
	},
	{
		posLo: [15, 10],
		posHi: [15, 10 + 3],
		renderer: 'common.LabelRenderer',
		init: [['Volatility', 'Repo', 'Dividend', 'Smile']]
	},
	{
		posLo: [16, 9],
		posHi: [16 + 9, 9],
		renderer: 'common.InputTextRenderer',
		name: 'DeformerStock'
	},
	{
		posLo: [16, 10],
		posHi: [16 + 9, 10],
		renderer: 'specific.DeformerRenderer',
		name: 'VolDeformer'
	},
	{
		posLo: [16, 11],
		posHi: [16 + 9, 11],
		renderer: 'specific.DeformerRenderer',
		name: 'RepoDeformer'
	},
	{
		posLo: [16, 12],
		posHi: [16 + 9, 12],
		renderer: 'specific.DeformerRenderer',
		name: 'DivDeformer'
	},
	{
		posLo: [16, 13],
		posHi: [16 + 9, 13],
		renderer: 'specific.DeformerRenderer',
		name: 'SmileDeformer'
	},

	// Result
	{
		pos: [9, 0],
		renderer: 'common.HeaderRenderer',
		init: 'message'
	},
	{
		posLo: [10, 0],
		posHi: [10 + 2, 0],
		renderer: 'common.LabelRenderer',
	},
	{
		posLo: [10, 1],
		posHi: [10 + 2, 1],
		renderer: 'common.OutputNumericRenderer',
	},
	{
		pos: [9, 1],
		renderer: 'common.OutputTextRenderer',
		name: 'message'
	},
	{
		posLo: [10, 0],
		posHi: [10 + 2, 1],
		// init: [[], [], []],
		name: 'pricingResult'
	},
];

var config = {
	table: tableConfig,
	block: blockConfig
};

export const lookup = tools.buildLookup(blockConfig);
// window.lookup = lookup;
export {tableConfig as table}
export {blockConfig as block}
//export { config as default };
