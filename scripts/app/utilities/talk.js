import {Api} from '../constants';
import User from './user';
import reqwest from 'reqwest';
import when from 'when';

export default {
	ask: function(data, callback) {
		reqwest({
			method: 'post',
			crossOrigin: true,
			url: Api.ANSWER,
			contentType: 'application/json',
			data: JSON.stringify(data),
			headers: {'X-Session-Token': User.get(sessionStorage, 'sessionID')},
			complete: response => {User.errorHandler(response, callback);}
		});
	},
	initialize: function(callback) {
		let suggestions = when(reqwest({
			method: 'get',
			crossOrigin: true,
			url: Api.SUGGESTIONS,
			headers: {'X-Session-Token': User.get(sessionStorage, 'sessionID')}
		}));

		let locationError = {
			status: 408,
			response: JSON.stringify({
				message: 'Could not retrieve location'
			})
		};

		let location = when.promise((resolve, reject) => {
			// For faster testing!
			resolve({latitude: 32.8781238, longitude: -117.2038344});

			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(response => {
					resolve(response.coords);
				});
			} else {
				reject(locationError);
			}
		}).timeout(15000, locationError);

		let piiFetch = when.promise((resolve, reject) => {
			User.fetchPii(resolve, reject);
		});

		when.join(suggestions, location, piiFetch)
			.then(response => {User.errorHandler(response, callback);})
			.catch(response => {User.errorHandler(response, callback);})
		;
	},
	updateFeedback: function(data, callback) {
		reqwest({
			method: 'post',
			crossOrigin: true,
			url: Api.ANSWER_FEEDBACK,
			contentType: 'application/json',
			data: JSON.stringify(data),
			headers: {'X-Session-Token': User.get(sessionStorage, 'sessionID')},
			complete: response => {User.errorHandler(response, callback);}
		});
	}
};