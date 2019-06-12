import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Loanboard from './loan-dash/Loanboard';

export default class Content extends React.Component {

	render() {
		return (
			<div>
				<Switch>
					<Route exact path='/expenses' component={Dashboard}/>
					<Route exact path='/loans' component={Loanboard}/>
				</Switch>
			</div>
		);
	}
}
