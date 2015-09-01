import Actions from '../actions';
import assign from 'object-assign';
import ConversationStore from '../stores/conversation';
import footer from './footer';
import motion from '../data/motion.js';
import React from 'react/addons';
import TransitionGroup from '../utilities/velocityTransitionGroup.js';
import {Spring} from 'react-motion';

let getState = () => {
	return {
		customQuestion: ConversationStore.get(['customQuestion']),
		isWaiting: ConversationStore.get(['isWaiting']),
		showQuestions: ConversationStore.get(['showQuestions']),
		questions: ConversationStore.get(['questions']),
		showAnswer: ConversationStore.get(['showAnswer']),
		answer: ConversationStore.get(['answer']),
		message: ConversationStore.get(['message']),
		showMessage: ConversationStore.get(['showMessage'])
	};
};

export default React.createClass(assign({}, {
	displayName: 'Conversation',
	getInitialState: function() {
		ConversationStore.initialize();
		return getState();
	},
	componentDidMount: function() {
		ConversationStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		ConversationStore.removeChangeListener(this._onChange);
	},
	render: function() {
		let transitionInner = [];

		let containerInner = [];

		containerInner.push(
			<ul className='questions' key='customQuestions'>
				<li className='custom'>
					<textarea
						type='text'
						value={this.state.customQuestion}
						placeholder='Enter your own question...'
						onChange={e => {
							Actions.Conversation.saveCustom(e.target.value);
						}}
						onKeyUp={e => {
							if(e.keyCode === 13) {
								Actions.Conversation.customSubmit();
							}
						}}
					></textarea>
					<button
						className='button medium positive'
						onClick={() => {Actions.Conversation.customSubmit();}}
					>Ask OME</button>
				</li>
			</ul>
		);

		containerInner.push(<h2 key='or'>Or select a question...</h2>);

		let questionsInner = [];

		this.state.questions.map(o => {
			questionsInner.push(
				<li
					key={o.questionId}
					onClick={() => {
						Actions.Conversation.ask({questionId: o.questionId});
					}}
				>{o.questionText}</li>
			);
		});

		containerInner.push(
			<ul className='questions' key='questions'>{questionsInner}</ul>
		);

		transitionInner.push(
			<Spring
				endValue={{
					val: {top: this.state.showQuestions},
					config: motion.stiff
				}}
				key='panelSpring'
			>
				{interpolated =>
					<div
						className='panel'
						key='panel'
						style={{
							top: `${interpolated.val.top}%`
						}}
					>
						<div className='container' key='container'>{containerInner}</div>
						{React.createElement(footer)}
					</div>
				}
			</Spring>
		);

		if(this.state.showAnswer) {
			transitionInner.push(React.DOM.div({
				key: 'answer',
				className: 'answer'
			}, this.state.answer.text));
		}

		if(this.state.isWaiting) {
			transitionInner.push(React.DOM.div({
				key: 'waiting',
				className: 'waiting'
			}, null));
		}

		if(this.state.showMessage) {
			transitionInner.push(React.DOM.div({
				className: 'message modal',
				key: 'message'
			},
				React.DOM.div({className: 'content centered'},
					React.DOM.h2(null, this.state.message)
				),
				React.DOM.div({className: 'controls'},
					React.DOM.button({
						className: 'button medium neutral',
						onClick: () => {Actions.Conversation.changeShowMessage(false);}
					}, 'Close')
				)
			));
		}

		return React.DOM.section({className: 'conversation'},
			React.createElement(TransitionGroup, {
				key: 'transition',
				className: 'customWrapper',
				transitionName: 'fade-fast',
				transitionAppear: true,
				component: 'div'
			}, transitionInner)
		);
	},
	_onChange: function() {
		this.setState(getState());
	}
}));