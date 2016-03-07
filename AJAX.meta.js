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


        logMeta: function (data, meta) {
                console.log('AJAX.js meta:', meta);
            },
            logProgress: function (data, meta, total) {
                console.log('AJAX.js:', Math.round(total.size / 1024), 'kb', Math.round(total.diff / 1000), 's', Math.round(meta.speed / 1024), 'kb/s');
            },
