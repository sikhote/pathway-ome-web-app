import {assign, events} from '../../libs';
import router from '../router';
import Dispatcher from '../dispatcher';
import Constants from '../constants';
import Validator from '../utilities/validator';
import Help from '../data/help';
import Authenticator from '../utilities/authenticator';

let CHANGE_EVENT = 'change';
let defaults = () => {
	return {
		name: 'create',
		isWaiting: false,
		currentStep: 'details',
		agreedToConsent: false
	};
};
let save = function(object, key, value) {
	// Save within storage
	if(object) {
		object[key] = value;
	}

	// Persist to session storage
	sessionStorage[storage.name] = JSON.stringify(storage);
};
let storage;

let Store = assign({}, events.EventEmitter.prototype, {
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	get: function(keys) {
		let value = storage;

		for(let key in keys) {
			value = value[keys[key]];
		}

		return value;
	},
	goToStep: function(step) {
		this.setCurrentStep(step);

		if(step == 'details') {
			router.transitionTo('create');
		} else {
			router.transitionTo(step);
		}
	},
	initialize: function(currentStep) {
		storage = assign({}, defaults(), {currentStep});
		save();
	},
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	setCurrentStep: function(step) {
		save(storage, 'currentStep', step);
	}
});

Dispatcher.register(function(action) {
	switch(action.actionType) {
		case Constants.Actions.CREATE_GO_TO_STEP:
			Store.goToStep(action.step);
			Store.emitChange();
			break;
		case Constants.Actions.CREATE_SET_CURRENT_STEP:
			Store.setCurrentStep(action.step);
			Store.emitChange();
			break;
	}
});

export default Store;