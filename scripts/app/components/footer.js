import assign from 'object-assign';
import base from './base';
import config from '../../config';
import React from 'react';
import {Link} from 'react-router';

export default React.createClass(assign({}, base, {
	displayName: 'Footer',
	render: function() {
		return (
			<footer className='global'>
				{'Pathway Genomics ' + new Date().getFullYear()}
				•
				<Link to='/consent'>Privacy & Terms</Link>
				•
				{'Version ' + config.version}
			</footer>
		);
	}
}));
