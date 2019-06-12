import React from 'react';
export default class Expenses {

	constructor( expenses = [] ){
		this.expenses = expenses;
	}

	setExpenses ( expenses ){
		this.expenses = expenses;
	}

	// When the function cannot be in this file because it keeps track of state in it's own file
	// we use this function to give it the expenses
	getExpenses () {
		return this.expenses;
	}

	getTotalIncomeMonthly( monthId, yearId ){
		let sum = 0
		for( let i = 0; i < this.expenses.length; i++ ){
			if( this.expenses[i].month === monthId && this.expenses[i].year === yearId ){
				for( let e in this.expenses[i] ){
					if( e === "income" ){
						sum += this.expenses[i][e]
					}
				}
			}
		}
		return sum
	}

	getTotalExpenseMonthly( monthId, yearId ){
		let sum = 0
		for( let i = 0; i < this.expenses.length; i++ ){
			if( this.expenses[i].month === monthId && this.expenses[i].year === yearId ){
				for( let e in this.expenses[i] ){
					if( e !== "month" && e !== "income" && e!== "year" ){
						sum += this.expenses[i][e]
					}
				}
			}
		}
		return sum
	}

	createOptions( monthId, yearId, nameVal = 0 ) {
		let options = []

		for( let i = 0; i < this.expenses.length; i++ ){
			if( this.expenses[i].month === monthId && this.expenses[i].year === yearId ){
				for( let e in this.expenses[i] ){
					if( e !== "month" && e!== "year" && e!== "income" ){
						// Decides if you want option tags for creating select objects
						// or if this function is serving a dual purpose for the charts to display options
						// as plaintext
						if( !nameVal )
							options.push( <option key={e + this.expenses[i].month.toString() + this.expenses[i].year.toString()} value={e}> {e} </option> )
						else {
							options.push( e.toString() )
						}
					}
				}
			}
		}
		return options
	}

	yearOptions() {
		let options = []
		let years = []

		for( let i = 0; i < this.expenses.length; i++ ){
			if( !years.includes(this.expenses[i].year) ){
				years.push( this.expenses[i].year )
				options.push( <option key={this.expenses[i].year} value={this.expenses[i].year}> {this.expenses[i].year} </option> )
			}
		}

		return options
	}

	// Populates array with names of months because Data() function for some reason
	// doesn't support it???
	monthOptions() {
		let options = []
		let monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
											"October", "November", "December"];

		for( let i = 0; i < monthsFull.length; i++ ){
			options.push( <option key={monthsFull[i]} value={i}>{monthsFull[i]}</option>)
		}
		return options

	}
}
