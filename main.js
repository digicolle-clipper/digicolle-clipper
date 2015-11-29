"use babel";

const electron = require('electron');
const nativeImage = electron.nativeImage;

var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var ipcMain = require('electron').ipcMain;
var AWS = require('aws-sdk');
var settings = require('./settings');
var request = require('request');

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

ipcMain.on('crop', (e, message) => {
  const data = JSON.parse(message);
  const img = nativeImage.createFromDataURL(data.data);
  console.log(data);
  fs.writeFile(`tmp/${+new Date()}.png`, img.toPng(), null);
  var upload = new AWS.S3.ManagedUpload({
    params: { Bucket: 'digicolle-clipper', Key: data.pid + '_' + Date.now() + '.png', Body: img.toPng() }
  });
  upload.send(function(err, data) {
    if (err) return;
    request.post(settings.endpoint + '/upload').form({ ndl_id: data.pid, photo: data.Location, description: data.description });
  });
});

ipcMain.on('measure', function(e, message) {
  var data = JSON.parse(message);
  const rect = data.rect;
  var windowPosition = mainWindow.getPosition();
  mainWindow.capturePage(rect, function(img) {
    mainWindow.send('cropdata', img.toDataURL());
  });
});
