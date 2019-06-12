import React from 'react';
import {Link} from 'react-router-dom';

const Nav = () => (
	<div className = "NavCont">
		<p className="navLink"><Link to='/expenses'> Dashboard </Link></p>
		<p className="navLink"><Link to='/loans'> Loans </Link></p>
	</div>
)

export default Nav
