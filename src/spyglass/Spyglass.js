import React from 'react';
import './Spyglass.css';

export default class Spyglass extends React.Component {

	render(){
		return(
			<div className="container">
				<div className="label">
					<p> {this.props.label} </p>
				</div>
				<div className="amount">
					<i>{this.props.value}</i>
				</div>
			</div>
		);
	}
}
