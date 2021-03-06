const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const PWM = require('./gpio/raspi-soft-pwm-wrapper/raspi-soft-pwm-wrapper').PWM;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

Promise.all([PWM(7), PWM(11), PWM(13), PWM(15)]).then((pwms) => {
  app.patch('/car', function(req, res, next) {
    // FIXME add security!
    const pulseModulations = req.body.pulseModulations;
    pulseModulations.forEach((pulseModulation, index) => {
      pwms[index].write(pulseModulation);
    });
    res.json({ wow: req.body });
  });
});

/*
this is how you would install the camera server
https://elinux.org/RPi-Cam-Web-Interface#Basic_Installation
sudo apt-get update
sudo apt-get dist-upgrade
git clone https://github.com/silvanmelchior/RPi_Cam_Web_Interface.git
cd RPi_Cam_Web_Interface/
./install.sh
go to: http://192.168.1.201/html/
*/

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const CAMERA_PORT = 3080;
app.get('/stream', (req, res) => {
  proxy.web(req, res, { target: `http://127.0.0.1:${CAMERA_PORT}` });
  // proxy.web(req, res, { target: `http://192.168.1.201:${CAMERA_PORT}` });
});

const port = parseInt(process.env.PORT || 80);
server.listen(port, '0.0.0.0', () => {
  console.log(`listening on ${port}`);
});
