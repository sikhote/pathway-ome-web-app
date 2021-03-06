import Actions from '../actions';
import React from 'react/addons';
import {Link} from 'react-router';
import User from '../utilities/user';
import WindowStore from '../stores/window';
import assign from 'object-assign';
import base from './base';

// Map navigation
let navItems = [
	{name: 'conversation'},
	{name: 'profile'},
	{
		name: 'logout',
		onClick: User.logout
	}
];

let getState = () => {
	return {
		windowWidth: WindowStore.get(['width']),
		windowBps: WindowStore.get(['bps'])
	};
};

export default React.createClass(assign({}, base, {
	displayName: 'Nav',
	componentDidMount: function() {
		WindowStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		WindowStore.removeChangeListener(this._onChange);
	},
	getInitialState: function() {
		WindowStore.initialize();
		return getState();
	},
	render: function() {
		let inner = [];

		navItems.map((item, index) => {
			let link;
			let span = (
				<span>
					{item.name == 'profile'? 'user profile' : item.name}
				</span>
			);
			let className = 'icon-' + item.name;

			// Output certain type of link
			if(item.onClick) {
				link = React.DOM.a({
					onClick: event => {
						if(this.state.windowWidth < this.state.windowBps[2]) {
							Actions.Home.toggleShowMenu();
						}

						item.onClick(event);
					},
					className,
					id: item.name
				}, span);
			} else {
				// If conversation link, point to home
				let to = item.name == 'conversation' ? '' : item.name;

				// Set correct active class name
				let activeClassName = 'active';
				if(this.props.path != '/' && item.name == 'conversation') {
					activeClassName = null;
				}

				link = React.createElement(Link, {
					to: '/' + to,
					className,
					activeClassName,
					onClick: () => {
						if(this.state.windowWidth < this.state.windowBps[2]) {
							Actions.Home.toggleShowMenu();
						}
					},
					id: item.name
				}, span);
			}

			// Push li to inner
			inner.push(React.DOM.li({key: index}, link));
		});

		return React.DOM.nav({className: 'global'}, React.DOM.ul(null, inner));
	},
	_onChange: function() {
		this.setState(getState());
	}
}));