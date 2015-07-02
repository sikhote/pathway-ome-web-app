import {assign, React, ReactRouter} from '../../libs';
import logo from '../components/logo';
import footer from '../components/footer';
import base from '../components/base';

export default React.createClass(assign({}, base, {
	displayName: 'Error',
	render: function() {
		let inner = [];

		inner.push(React.DOM.h1({key: 0},
			React.createElement(ReactRouter.Link,
				{key: 1, to: "home"}, React.createElement(logo, null)
			)
		));

		inner.push(React.DOM.p({key: 1},
			'Sorry, there was an error. ',
			React.createElement(ReactRouter.Link,
				{key: 1, to: "home"}, "Click here"
			),
			' to start over.'
		));

		return React.DOM.div({className: 'error view standard thin'}, [
			React.DOM.div({className: 'wrapper', key: 0}, inner),
			React.createElement(footer, {key: 1})
		]);
	},
	_onChange: function() {
		this.setState(getState());
	}
}));