
export class dateString {
	constructor(string) {
		// string must be YYYY-MM-DD format
		if (string !== 'today') {
			this.date = new Date(string);
		}
		else {
			this.date = new Date();
		}
		this.buildString();
		return this.string;
	}

	buildString() {
		this.string = this.date.toISOString().slice(0, 10);
	}

	addMonth(n) {
		this.date = new Date(this.date.setMonth(this.date.getMonth() + n));
		this.buildString();
		return this.string;
	}

	addYear(n) {
		this.date = new Date(this.date.setFullYear(this.date.getFullYear() + n));
		this.buildString();
		return this.string;
	}
}


export const capitalizeFirst = function (str) {
	if (!str) return '';
	str = str.toString();
	return str.charAt(0).toUpperCase() + str.slice(1)
};

export const capitalize = function (str) {
	return str.split(' ').map(e => capitalizeFirst(e)).join(' ');
};


export const isInKeys = (obj, key) => (Object.keys(obj).indexOf(key) > -1);

export const isInArr = (arr, elt) => (arr.indexOf(elt) > -1);

export const isValid = (value) => !((value === '') || (value === undefined) || (value === null));