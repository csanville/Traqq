import React from 'react';
import 'whatwg-fetch';
import './Dashboard.css';
import Spyglass from '../spyglass/Spyglass.js';
import Charter from '../charts/Charter.js';
import Expenses from '../Libraries/FinanceMath.js';
import MonthData from '../data-holds/MonthData.js';

export default class Dashboard extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			expenses: [],
			hashExp: {},
			isLoaded: false,
			date: new Date(),
			specificExpense: "misc",
			timeframe: "Monthly",
			selMonth: new Date().getMonth(),
			selYear: new Date().getFullYear(),
			noData: false,
			expenseData: new Expenses()
		}

		//Data Pull Function
		this.fetchData = this.fetchData.bind(this)
		//Helper functions
		this.checkMonthDataAval = this.checkMonthDataAval.bind(this)
		this.renderSpyGlasses = this.renderSpyGlasses.bind(this)
		this.getTotalForExpense = this.getTotalForExpense.bind(this)
		//Handlers
		this.handleDropdown = this.handleDropdown.bind(this)
		this.handleMonthDropdown = this.handleMonthDropdown.bind(this)
		this.handleYearDropdown = this.handleYearDropdown.bind(this)
	}

	componentDidMount() {
		this.fetchData()
	}

	fixMonth( monthInt, wantFull = 0 ) {
		// REVIEW: Research possible way to skip this hardcode. Must be way to get directly from built-in.
		let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
		let monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
		 							"October", "November", "December"];
		if( wantFull ){
			return monthsFull[monthInt]
		}
		else{
			return months[monthInt]
		}
	}

	// Fetches data from JSON file stored in local files served from Express Server
	fetchData() {
		fetch('http://localhost:2020/financials/financials.json')
		.then( (res) => res.json() )
		.then( (json) => {
			this.setState( {expenseData: new Expenses(json), isLoaded: true} )
			console.log("Returned file: ", json)
			//Create a hashMap of all months according to their month+year for easy indexing
			let expenses = this.state.expenseData.getExpenses()
			let newHash = this.state.hashExp
			for( let i = 0; i < expenses.length; i++ ){
				let month = new MonthData( expenses[i] )
				newHash[ month.getKey() ] = month
			}
			this.setState({ hashExp: newHash })
		}).catch( function(ex){
			console.log("Parsing Failed.", ex)
		})
	}

	// Gets total amount spent on an expense for current month/year
	// KEEPS STATE
	getTotalForExpense( expense = "misc" ) {
		const{ expenseData, selMonth, selYear, specificExpense } = this.state
		if( expense !== specificExpense ){
			this.setState( {specificExpense: expense} )
		}
		// This function keeps track of State, so we cannot move it to a new file.
		let expenses = expenseData.getExpenses()

		let sum = 0
		for( let i = 0; i < expenses.length; i++ ){
			if( expenses[i].month === selMonth && expenses[i].year === selYear ){
				for( let e in expenses[i] ){
					if( e === expense ){
						sum += expenses[i][e]
					}
				}
			}
		}
		return sum
	}

	// REVIEW: Possible timeframe functionality
	toggleTimeframe(){
		// NOT YET IMPLEMENTED
	}

	// Keeps track of the state of no data, cannot be moved to a new file (unless workaround is found)
	checkMonthDataAval( monthId, yearId = this.state.selYear ) {
		const {expenseData, noData} = this.state
		let expenses = expenseData.getExpenses()
		for( let i = 0; i < expenses.length; i++ ){
			if( expenses[i].month === monthId && expenses[i].year === yearId ){
				if( noData === true ){
					this.setState( {noData:false} )
				}
				return true
			}
		}
		if( noData === false ){
			this.setState( {noData:true} )
		}
		return false
	}

	// Grabs raw number data for display in charts for that month/year
	// KEEPS STATE!
	extractData( monthId = this.state.selMonth, yearId = this.state.selYear ){
		const {hashExp} = this.state
		// Check for "HashMap not loaded with data yet".
		if( Object.keys( hashExp ).length === 0 ){
			return []
		}
		// Key is not in hashtable
		if( !(monthId.toString() + yearId.toString() in hashExp) ){
			return []
		}
		let data = []
		let month = hashExp[ monthId.toString() + yearId.toString() ]
		for( let e in month.getRawData() ){
			if( e !== "month" && e !== "year" && e !== "income" ){
				data.push( month.getRawData()[e] )
			}
		}
		return data
	}

	// Handles dropdown state for choosing a specific expense to display in Spyglass
	handleDropdown(e){
		this.setState( {specificExpense: e.target.value} )
	}
	handleMonthDropdown(e){
		this.checkMonthDataAval( parseInt(e.target.value) )
		this.setState( {selMonth: parseInt(e.target.value) } )
	}
	handleYearDropdown(e){
		this.checkMonthDataAval( this.state.selMonth, parseInt(e.target.value) )
		this.setState( {selYear: parseInt(e.target.value) } )
	}

	renderSpyGlasses() {
		const {selMonth, selYear, specificExpense, timeframe, expenseData } = this.state
		let income = expenseData.getTotalIncomeMonthly( selMonth, selYear )
		let exp = expenseData.getTotalExpenseMonthly( selMonth, selYear )
		let specific = this.getTotalForExpense( specificExpense )

		return (
			//JSX Fragment
			<>
				<Spyglass label={"Total " + timeframe + " Expense"} value={exp}/>
				<Spyglass label={"Total " + timeframe + " Income"} value={income}/>
				<div className="specGlassCont">
					<Spyglass className="spyGlassInCont" label={"Total " + timeframe + " for " + specificExpense} value={specific} />
					<select className="specDropDown" value={specificExpense} onChange={this.handleDropdown}>
						{expenseData.createOptions( selMonth, selYear )}
					</select>
					<code><i>{((specific/exp)*100).toPrecision(2)}% of Total Monthly Expense </i></code>
				</div>
			</>
		);
	}

	render() {
		const {isLoaded, date, selMonth, selYear, noData, expenseData} = this.state

		// for( let i = 0; i < dateRange.length; i++ ){
		// 	let chartPack = []
		// 	chartPack.push( chartData )
		// }

		let chartData = {
			labels: expenseData.createOptions( selMonth, selYear, 1 ),
			datasets: [
				{
					label: this.fixMonth( selMonth, 1) + " " + selYear,
					data: this.extractData( selMonth, selYear ),
					backgroundColor: 'rgba(0, 120, 145, 0.5)',
					lineTension: .05

				},
				{
					label: this.fixMonth( date.getMonth(), 1 ) + " " + date.getFullYear(),
					data:this.extractData( date.getMonth(), date.getFullYear() ),
					backgroundColor: 'rgba(120, 145, 20, 0.5)',
					lineTension: .05
				}
			]
		}

		let chartOptions = {
			maintainAspectRatio: true,
			scale: {
    		ticks: {
	        beginAtZero: true,
	        max: 2000,
	        min: 0,
	        stepSize: 200
    		}
			}
		}

		// Data is currently loading from API endpoint.
		if( !isLoaded ) {
			return (
				<div className="dash">
					<strong className="dashHead"> DASHBOARD </strong>
					<br/>
					<p> Expenses </p>
					<div>
						<div className="loadingText"> ~~~ Loading Data ~~~ </div>
					</div>
				</div>
			);
		}
		// There is no data available for selected timeframe.
		else if( noData ) {
			return (
				<div className="dash">
					<strong> DASHBOARD </strong> <i> Current Date: </i> <strong> {this.fixMonth(date.getMonth(), 1) + ", "+ date.getDate() + " "+ date.getFullYear() } </strong>
					<br/>
					<p> Expenses </p>
					<p> Month of <strong>{this.fixMonth(selMonth,1)} </strong> for <strong>{selYear}</strong></p>
					<select value={selMonth} onChange={this.handleMonthDropdown}>
						{expenseData.monthOptions()}
					</select>
					<select value={selYear} onChange={this.handleYearDropdown}>
						{expenseData.yearOptions()}
					</select>
					<div>
						<div className="loadingText"> ~~~ NO DATA AVAILABLE  for <strong> {this.fixMonth( selMonth, 1)}, {selYear} </strong>~~~ </div>
					</div>
				</div>
			);
		}
		// Return loaded data!
		else {
			return (
				<>
					<div className="dash">
						<strong> DASHBOARD </strong> <i> Current Date: </i> <strong> {this.fixMonth(date.getMonth(), 1) + ", "+ date.getDate() + " "+ date.getFullYear() } </strong>
						<br/>
						<p> Expenses </p>
						<p> Month of <strong>{this.fixMonth(selMonth,1)} </strong> for <strong>{selYear}</strong></p>
						<select value={selMonth} onChange={this.handleMonthDropdown}>
							{expenseData.monthOptions()}
						</select>
						<select value={selYear} onChange={this.handleYearDropdown}>
							{expenseData.yearOptions()}
						</select>
						<div>
							{this.renderSpyGlasses()}
						</div>
					</div>
					<div className="charts">
						<Charter data = {chartData} />
					</div>
				</>
			);
		}
	}
}
