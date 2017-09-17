var Express = require('express')

let app = Express()


app.set('port', 4040);

// app.get('/incoming-sms', (req, res) => {
app.get('/', (req, res) => {
  console.log(req.query)
  res.sendStatus(200)
});


app.listen(app.get('port'));

console.log("LISTENING");


