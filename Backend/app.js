function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

var Nexmo = require('nexmo');

var nexmo = new Nexmo({
    apiKey: '',
    apiSecret: '',
  });

var Express = require('express')

let app = Express()

var RTM = require("satori-rtm-sdk");

var endpoint = "";
var appkey = "";

var client = new RTM(endpoint, appkey);

client.on('enter-connected', function () {
	console.log('Connected to Satori RTM!');
	app.get('/', (req, res) => {
		console.log(req.query.text)
		res.sendStatus(200)
	
		var channelName = 'help';
		msg1 = parse('%s', req.query.text);
		var message = {
			who: 'zebra',
			msg: msg1,
		};
		client.publish(channelName, message , function (pdu) {
			if (pdu.action === 'rtm/publish/ok') {
				console.log('Publish confirmed');
			} else {
				console.log('Failed to publish. RTM replied with the error ' +
						pdu.body.error + ': ' + pdu.body.reason);
			}
		});
	});
});

app.set('port', 4040);

client.start();

app.listen(app.get('port'));


console.log("LISTENING");


