AJAX = {

	get: function(url) {
		var request = new XMLHttpRequest();
		if (!request) return false;
		//        request.open('GET', url, true);
		return new AJAX.stream(request, url, 'GET');
	},
	post: function(url) {},

	log: function(data) {
		console.log('AJAX.js:', data);
	},
	stream: function(request, url, method) {
		this._request = request;
		this._url = url;
		this._method = method;
		this._started = false;
		this._onSuccess = null;
		this._onProgress = null;
		this._lastProgressPosition = 0;
		//        this._meta = {
		//            startTime: 0,
		//            chunks: [],
		//            final: {}
		//        };

		//        this._dataType = null;
		this._paramString = '';
		this._progressDelimiter = "\n\n\n";


		this._request.onreadystatechange = function() {
			//            console.log('ready-state-change', this._request.readyState);
			if (this._request.readyState == 4) {

				//                this._meta.final = this.makeMeta(this._meta.startTime, this._request.responseText);
				//                var chunkMeta = this.makeMeta(this._meta.lastChunkTime, this._request.responseText.substring(this._lastProgressPosition));
				//                this._meta.chunks.push(chunkMeta);
				//                this._meta.lastChunkTime = Date.now();

				if (this._onProgress)
					this._onProgress(this.parse(this._request.responseText.substring(this._lastProgressPosition)));
				//                    this._onProgress(this.parse(this._request.responseText.substring(this._lastProgressPosition)), chunkMeta, this._meta.final);
				if (this._onSuccess)
					this._onSuccess(this.parse(this._request.responseText));
				//                    this._onSuccess(this.parse(this._request.responseText), this._meta.final);
			}
		}.bind(this);

		this._request.onprogress = function() { // addEventListener?? instead of == ??
			//            console.log("PROGRESS", this._lastProgressPosition);
			while (1) { // maybe thats the problem?
				var pos = this._request.response.indexOf(this._progressDelimiter, this._lastProgressPosition);
				if (pos == -1) break;
				var item = this._request.response.substring(this._lastProgressPosition, pos);
				this._lastProgressPosition = pos + this._progressDelimiter.length;

				//                var chunkTotal = this.makeMeta(this._meta.startTime, this._request.responseText);
				//                var chunkMeta = this.makeMeta(this._meta.lastChunkTime, item);
				//                this._meta.chunks.push(chunkMeta);
				//                this._meta.lastChunkTime = Date.now();

				if (this._onProgress)
					this._onProgress(this.parse(item), chunkMeta, chunkTotal);
			}
		}.bind(this);



		this.start = function() {
			if (!this._started) {
				var url = this._url + (this._paramString ? ('?' + this._paramString) : '');
				this._request.open(this._method, url, true);
				this._request.send();
				this._started = true;
				//                this._meta.startTime = Date.now();
				//                console.log('AJAX-load:', url);
			}
			return this;
		}.bind(this);
		//        this.start();

		this.onSuccess = function(callback) {
			this._onSuccess = callback;
			return this.start();
		}.bind(this);
		this.then = this.onSuccess;

		this.onProgress = function(callback) {
			this._onProgress = callback;
			return this.start();
		}.bind(this);

		this.progressDelimiter = function(string) {
			this._progressDelimiter = string;
			return this;
		}.bind(this);

		this.parameters = function(parameters) {
			var tmp = [];
			for (var key in parameters)
				tmp.push(key + '=' + parameters[key]);
			this._paramString = tmp.join('&');
			//            console.log('paramString', this._paramString);
			return this;
		}.bind(this);

		this.parse = function(text) {
			try {
				return JSON.parse(text);
			} catch (e) {
				return text;
			}
		}.bind(this);


	},


}