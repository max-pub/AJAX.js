AJAX = {
	parse: function(text) {
		try {
			return JSON.parse(text);
		} catch (e) {
			return text;
		}
	},
	QS: function(p) {
		var esc = encodeURIComponent;
		return Object.keys(p)
			.map(function(k) {
				return esc(k) + '=' + esc(p[k])
			})
			.join('&');
	},
	base: function(f) {
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function(p) {
			if (f) f(AJAX.parse(xhr.responseText));
		});
		return xhr;
	},
	GET: function(url, f) {
		var xhr = AJAX.base(f);
		xhr.open("GET", url, true);
		xhr.send();
		return xhr;
	},
	POST: function(url, data, f) {
		var xhr = AJAX.base(f);
		xhr.open("POST", url, true);
		data = AJAX.QS(data);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(data);
		return xhr;
	},
	PUT: function(url, data, f) {
		var xhr = AJAX.base(f);
		xhr.open("PUT", url, true);
		data = AJAX.QS(data);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(data);
		return xhr;
	}
}