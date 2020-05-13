const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express');
// const serveIndex = require('serve-index');
const path = require('path');
const rootPath = path.resolve(__dirname, './');
// const getFonts = require('./getFonts');
// const getClips = require('./getClips');
let app = express();

// app.use('/', express.static(rootPath, {
//     setHeaders: function (res) {
//         res.set('Access-Control-Allow-Origin', '*');
//     }
// }), serveIndex(rootPath, { 'icons': true }))
let port = 9000;



// app.get('/getFont', getFonts);
// app.get('/getClips', getClips);
app.get('/test2', (req, res) => {
    res.setHeader('X-Foo', 'Bar');
    console.log(req.headers);   
    console.log('request received');
    res.send('ok');
});

app.post('/', (req, res) => {
    res.setHeader('X-Foo', 'Bar2');
    // 使用write会使服务器产生Transfer-Encoding: chunked编码
    res.write('hello');
    res.write(' world!');
    res.end();
})

let options = {
    key: fs.readFileSync(path.resolve('./server.key')),
    cert: fs.readFileSync(path.resolve('./server.crt'))
}

http.createServer((req, res) => {
    res.setHeaders('X-Foo', 'Foo');
});


app.listen(port, () => {
    console.log('Example App is running on port: ' + port);
});

// https.createServer(options, app).listen(port);
