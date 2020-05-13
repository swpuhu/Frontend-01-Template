const net = require('net');

class Request {
    // method, url = host + port + path
    // body: key: value
    // header
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.body = options.body || {};
        this.path = options.path;
        this.headers = options.headers || {};
        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => {
                return `${key}=${encodeURIComponent(this.body[key])}`
            }).join('&');
            this.headers['Content-Length'] = this.bodyText.length;
        }
    }

    open(method, url) {

    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }

    send(connection) {
        let response = new Response();
        return new Promise((resolve, reject) => {
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                });


                connection.on('data', (data) => {
                    response.parser.receive(data.toString());
                    if (response.parser.bodyParser && response.parser.bodyParser.isFinished) {
                        resolve(response.parser.response);
                    }
                    // console.log(response.parser.headers);
                    connection.end();
                });
                connection.on('end', () => {
                    resolve();
                    console.log('disconnected from server');
                });
                connection.on('error', (err) => {
                    console.log(err);
                    reject();
                })
            }

        });
    }
}

class Response {
    constructor() {
        this.parser = new ResponseParser();
    }
}

class ResponseParser {
    constructor () {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_VALUE = 3;
        this.WAITING_HEADER_LINE_END = 4;
        this.WAITING_HEADER_BLOCK_END = 5;
        this.WAITING_BODY = 6;
        this.WAITING_HEADER_SPACE = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
    }

    /**
     * 
     * @param {String} string 
     */
    receive (string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
        console.log(this.statusLine);
    }

    get isFinished () {
        this.bodyParser && this.bodyParser.isFinished;
    }

    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);

        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receiveChar (char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            if (this.bodyParser) {
                this.bodyParser.receiveChar(char);
            }
            
        }
    }
}

class TrunkedBodyParser {
    constructor () {
        this.WAITING_LENGTH = 1;
        this.WAITING_LENGTH_LINE_END = 2;
        this.READING_TRUNK = 3;
        this.WAITING_NEW_LINE = 4;
        this.WAITING_NEW_LINE_END = 5;
        this.READING_TRUNK_END = 6;
        this.READING_TRUNK_LINE_END = 7;
        this.isFinished = false;
        this.length = 0;
        this.content = [];
        this.current = this.WAITING_LENGTH;
    }

    receiveChar(char) {
        // console.log(char);
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                let length = char.charCodeAt(0) - '0'.charCodeAt(0);
                if (length === 0) {
                    this.isFinished = true;
                    console.log(this.content.join(''));
                }
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            // console.log('//////');
            
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
            
        } else if (this.current === this.READING_TRUNK) {
            if (char === '\r') {
                this.current = this.READING_TRUNK_END;
            } else {
                this.content.push(char);
            }
            
        } else if (this.current === this.READING_TRUNK_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 9000,
    path: '/',
    "Content-Type": 'application/x-www-form-urlencoded',
    headers: {
        "X-Foo-Client": 'huhu'
    },
    body: {
        hello: 'huhu'
    }
});
request.send().then(data => {
    console.log(data);

})




