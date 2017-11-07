// server to debug fetch api
const express = require('express');
const cors = require('cors');
const app = new express();
const PWM = require('./gpio/raspi-soft-pwm-wrapper/raspi-soft-pwm-wrapper').PWM;
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

Promise.all([PWM(7), PWM(11)]).then(([pwm7, pwm11]) => {
  app.patch('*', function(req, res, next) {
    pwm7.write(0);
    pwm11.write(0);
    console.log(req.body); res.json({ wow: 'x' });
  });
})


app.listen(8432);
