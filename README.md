
upload, download and stream data
return data is automatically parsed into JSON-object if possible
[Demo](http://lib.max.pub/ajax.js)

*simple request & logging of the results*
```javascript
AJAX.get('http://abc.com/file.json').then( AJAX.log )
```


```javascript
AJAX.get('http://max.pub/weather-stream.php')        // the URL to call
    .parameters({city:'Hamburg', date:'2000-01-01'}) // will be transformed into a url-query-string
    .progressDelimiter("\n\n\n")                     // string that separates the chunks
    .onProgress(function(partialResponse, metaData){
        // this will be called repeatedly when new data arrives
    });
```

