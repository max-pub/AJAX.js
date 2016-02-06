AJAX = {

    get: function (url) {
        var request = new XMLHttpRequest();
        if (!request) return false;
        //        request.open('GET', url, true);
        return new AJAX.stream(request, url, 'GET');
    },
    post: function (url) {},

    log: function (data) {
        console.log('AJAX.js:', data);
    },
    logMeta: function (data, meta) {
        console.log('AJAX.js meta:', meta);
    },
    logProgress: function (data, meta, total) {
        console.log('AJAX.js:', Math.round(total.size / 1024), 'kb', Math.round(total.diff / 1000), 's', Math.round(meta.speed / 1024), 'kb/s');
    },
    stream: function (request, url, method) {
        this._request = request;
        this._url = url;
        this._method = method;
        this._started = false;
        this._onSuccess = null;
        this._onProgress = null;
        this._lastProgressPosition = 0;
        this._meta = {
            startTime: 0,
            chunks: [],
            final: {}
        };
        //        this._dataType = null;
        this._paramString = '';
        this._progressDelimiter = "\n\n\n";

        this.start = function () {
            if (!this._started) {
                var url = this._url + (this._paramString ? ('?' + this._paramString) : '');
                this._request.open(this._method, url, true);
                this._request.send();
                this._started = true;
                this._meta.startTime = Date.now();
                console.log('AJAX-load:', url);
            }
        }.bind(this);
        //        this.start();

        this.onSuccess = function (callback) {
            this._onSuccess = callback;
            this.start();
            return this;
        }.bind(this);
        this.then = this.onSuccess;

        this.onProgress = function (callback) {
            this._onProgress = callback;
            this.start();
            return this;
        }.bind(this);

        this.progressDelimiter = function (string) {
            this._progressDelimiter = string;
            return this;
        }.bind(this);

        this.parameters = function (parameters) {
            var tmp = [];
            for (var key in parameters)
                tmp.push(key + '=' + parameters[key]);
            this._paramString = tmp.join('&');
            //            console.log('paramString', this._paramString);
            return this;
        }.bind(this);

        this.parse = function (text) {
            try {
                return JSON.parse(text);
            } catch (e) {
                return text;
            }
        }.bind(this);

        this.makeMeta = function (startTime, data) {
            var now = Date.now();
            var meta = {
                time: now,
                diff: now - startTime,
                size: data.length
            };
            meta.speed = Math.round(meta.size / meta.diff * 1000);
            if (meta.speed == Infinity) meta.speed = meta.size;
            return meta;
        };

        this._request.onreadystatechange = function () {
            //            console.log('ready-state-change', this._request.readyState);
            if (this._request.readyState == 4) {

                this._meta.final = this.makeMeta(this._meta.startTime, this._request.responseText);
                var chunkMeta = this.makeMeta(this._meta.lastChunkTime, this._request.responseText.substring(this._lastProgressPosition));
                this._meta.chunks.push(chunkMeta);
                this._meta.lastChunkTime = Date.now();

                if (this._onProgress)
                    this._onProgress(this.parse(this._request.responseText.substring(this._lastProgressPosition)), chunkMeta, this._meta.final);
                if (this._onSuccess)
                    this._onSuccess(this.parse(this._request.responseText), this._meta.final);
            }
        }.bind(this);

        this._request.onprogress = function () {
            //            console.log("PROGRESS", this._lastProgressPosition);
            while (1) {
                var pos = this._request.response.indexOf(this._progressDelimiter, this._lastProgressPosition);
                if (pos == -1) break;
                var item = this._request.response.substring(this._lastProgressPosition, pos);
                this._lastProgressPosition = pos + this._progressDelimiter.length;

                var chunkTotal = this.makeMeta(this._meta.startTime, this._request.responseText);
                var chunkMeta = this.makeMeta(this._meta.lastChunkTime, item);
                this._meta.chunks.push(chunkMeta);
                this._meta.lastChunkTime = Date.now();

                if (this._onProgress)
                    this._onProgress(this.parse(item), chunkMeta, chunkTotal);
            }
        }.bind(this);

    },


}




//        this.dataType = function (typ) {
//            this._dataType = typ;
//            return this;
//        }.bind(this);


//                var p = this._request;
//                if (this._dataType == 'json') p = JSON.parse(this._request.responseText);
//                console.log('progress', item);
//                if (this._dataType == 'json') item = JSON.parse(item);
//                console.log('---JSON', item);



//    base: function (url, options) {
//        if (!options) options = {
//            post: ''
//        };
//        var request = new XMLHttpRequest();
//        if (!request) return false;
//        var method = (options.post) ? "POST" : "GET";
//        request.open(method, url, true);
//        if (options.post)
//            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//        request.send(options.post);
//        return request;
//    },

//    download: function (url, onDone, options) {
//        var request = AJAX.base(url, options);
//        if (!request) return false;
//
//        request.onreadystatechange = function () {
//            if (request.readyState == 4)
//                if (onDone) onDone(request.response);
//        }
//        return request;
//    },
//
//
//    stream2: function (url, onUpdate, onFinish, options) {
//        if (!options) options = {
//            splitString: "\n\n\n"
//        };
//        var request = AJAX.base(url, options);
//        if (!request) return false;
//
//        request.onreadystatechange = function () {
//            if (request.readyState == 4) {
//                if (onFinish) onFinish(request.responseText);
//                if (onUpdate) onUpdate(request.response.substring(lastPos)); // last bits that havent been covered by "onprogress"
//            }
//        }
//
//        var lastPos = 0;
//        request.onprogress = function () {
//            while (1) {
//                var pos = request.response.indexOf(options.splitString, lastPos);
//                if (pos == -1) break;
//                var item = request.response.substring(lastPos, pos);
//                lastPos = pos + options.splitString.length;
//                if (onUpdate) onUpdate(item);
//            }
//        }
//        return request;
//    },
//
//    upload: function (url, data) {}
