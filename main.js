"use babel";

var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var ipcMain = require('electron').ipcMain;
var AWS = require('aws-sdk');
var settings = require('./settings');
AWS.config.accessKeyId = settings.aws_key;
AWS.config.secretAccessKey = settings.aws_secret;
var currentURL = null;

require('crash-reporter').start();
var mainWindow = null;
var clipWindow = null;

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {
  mainWindow = new BrowserWindow({ width: 1000, height: 600 });
  mainWindow.loadURL('file://' + __dirname + '/public/index.html');
  mainWindow.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

ipcMain.on('cropdata', function(e, message) {
  var data = JSON.parse(message);
  const rect = data.rect;
  var windowPosition = mainWindow.getPosition();
  rect.x -= windowPosition[0];
  rect.y -= windowPosition[1];
  mainWindow.capturePage(data.rect, function(img) {
    //mainWindow.send('clipstart', img.toDataURL());
    // var upload = new AWS.S3.ManagedUpload({
    //   params: {Bucket: 'digicolle-clipper', Key: id + '_' + Date.now() + '.png', Body: img.toPng()}
    // });
    // upload.send(function(err, data) {
    //   console.log(err, data);
    // });
    fs.writeFile("test.png", img.toPng(), null);
  });
});
