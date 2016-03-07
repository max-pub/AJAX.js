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
