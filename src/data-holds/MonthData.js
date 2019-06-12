import React from 'react';

export default class MonthData {
	constructor( data ){
		this.key = data.month.toString() + data.year.toString()
		this.id = data.month
		this.year = data.year
		this.data = data
	}

	getKey(){
		return this.key
	}

	getRawData() {
		return this.data
	}
}
