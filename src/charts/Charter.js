import React from 'react';
import './Charter.css';
import {Pie} from 'react-chartjs-2';

export default class Charter extends React.Component {

	constructor(props){
		super(props);
		this.state={
			
		}
	}
	render() {
		return(
			<div className="chart">
				<Pie
					data = {this.props.data}
					options={this.props.options}
				/>
			</div>
		);
	}
}
