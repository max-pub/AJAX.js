AJAX = {
	get: function(url) {
		var request = new XMLHttpRequest();
		if (!request) return false;
		//        request.open('GET', url, true);
		return new AJAX.load(request, url, 'GET');
	},

	post: function(url, data) {
		var request = new XMLHttpRequest();
		if (!request) return false;
		// var fd = new FormData();
		// for (var key in data)
		// 	fd.append(key, data);
		var fd = AJAX.parameters(data);
		console.log('post', data);
		return new AJAX.load(request, url, 'POST', fd);

	},
	parameters: function(p) {
		var tmp = [];
		for (var key in p)
			tmp.push(key + '=' + p[key]);
		return tmp.join('&');
	},

	parse: function(text) {
		try {
			return JSON.parse(text);
		} catch (e) {
			return text;
		}
	},

	load: function(request, url, method, data) {
		this._request = request;
		this._onSuccess = [];

		this._request.onreadystatechange = function() {
			if (this._request.readyState == 4) {
				for (var i = 0; i < this._onSuccess.length; i++)
					this._onSuccess[i](AJAX.parse(this._request.responseText));
			}
		}.bind(this);

		this.onSuccess = function(callback) {
			this._onSuccess.push(callback);
			return this;
		}.bind(this);
		this.then = this.onSuccess;

		this._request.open(method, url, true);
		this._request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		// this._request.setRequestHeader('Content-Type', 'text/plain');
		this._request.send(data);
	}
}



// get: function(url, f) {
// 	var xhr = new XMLHttpRequest();
// 	if (!xhr) return false;
// 	xhr.addEventListener('load', function(p) {
// 		if (f) f(NET.parse(xhr.responseText));
// 	});
// 	xhr.open('GET', url, true);
// 	xhr.send();
// 	return xhr;
// },
// post: function(url, data, f) {
// 	var xhr = new XMLHttpRequest();
// 	if (!xhr) return false;
// 	xhr.addEventListener('load', function(p) {
// 		if (f) f(NET.parse(xhr.responseText));
// 	});
// 	xhr.open('POST', url, true);
// 	data = AJAX.parameters(data);
// 	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 	xhr.send(data);
// 	return xhr;
// }


// var esc = encodeURIComponent;
// var query = Object.keys(params)
//     .map(k => esc(k) + '=' + esc(params[k]))
//     .join('&');


// parameters: function(parameters) {
// 	var tmp = [];
// 	for (var key in parameters)
// 		tmp.push(key + '=' + parameters[key]);
// 	return tmp.join('&');
// },

// 	log: function(data) {
// 	console.log('AJAX.js:', data);
// },