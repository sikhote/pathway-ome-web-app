// Credit to https://gist.github.com/tkafka/0d94c6ec94297bb67091

import {React, Velocity} from '../../libs';
import transitions from '../data/transitions';

let VelocityTransitionGroupChild = React.createClass({
	displayName: "VelocityTransitionGroupChild",
	propTypes: {transitionName: React.PropTypes.string.isRequired},
	_getTransition: function() {
		if (!transitions[this.props.transitionName]) {
			console.warn(
				'Transition ' + this.props.transitionName + ' not found.'
			);
		}

		return transitions[this.props.transitionName] || transitions.default;
	},
	componentWillEnter: function(done) {
		let node = this.getDOMNode();
		let transition = this._getTransition();

		Velocity(
			node,
			transition.enter,
			{
				duration: transition.duration,
				complete: done
			}
		);
	},
	componentWillLeave: function(done) {
		let node = this.getDOMNode();
		let transition = this._getTransition();
		Velocity(
			node,
			transition.leave,
			{
				duration: transition.duration,
				complete: done
			}
		);
	},
	render: function() {
		return React.Children.only(this.props.children);
	}
});

let VelocityTransitionGroup = React.createClass({
	displayName: "VelocityTransitionGroup",
	propTypes: {transitionName: React.PropTypes.string.isRequired},
	_wrapChild: function(child) {
		return (
			React.createElement(
				VelocityTransitionGroupChild,
				{transitionName: this.props.transitionName},
				child
			)
		);
	},
	render: function() {
		return (React.createElement(
			React.addons.TransitionGroup, React.__spread({}, this.props,
				{childFactory: this._wrapChild})
			)
		);
	}
});

export default VelocityTransitionGroup;