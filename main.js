"use babel";

var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var ipcMain = require('electron').ipcMain;
var screenshot = require('electron-screenshot');
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
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
	mainWindow.webContents.on('dom-ready', function () {
		//mainWindow.openDevTools();
	});
});

ipcMain.on('asynchronous-message', function (event, arg) {
	var data = JSON.parse(arg);
	console.log(data);
	switch (data.type) {
		case "showclip":
			currentURL = data.url;
			const Screen = require('screen')
			const size = Screen.getPrimaryDisplay().size
			clipWindow = new BrowserWindow({
				left: 0,
				top: 0,
				width: size.width,
				height: size.height,
				frame: false,
				show: true,
				transparent: true,
				resizable: false,
				'always-on-top': true
			})

			clipWindow.maximize()

			clipWindow.loadURL(`file://${__dirname}/clip.html`)
			clipWindow.on('closed', function () {
				clipWindow = null
			})
			break;
		default:
			clipWindow.close();
			if(!/^http:\/\/dl.ndl.go.jp\/info:ndljp\/pid\//.test(currentURL)) return;
			var id = currentURL.split('/').pop();
			var rect = data.rect;
			var windowPosition = mainWindow.getPosition();
			rect.x -= windowPosition[0];
			rect.y -= windowPosition[1];
			setTimeout(function () {
				mainWindow.capturePage(rect, function(img) {
					var upload = new AWS.S3.ManagedUpload({
						params: {Bucket: 'digicolle-clipper', Key: id + '_' + Date.now() + '.png', Body: img.toPng()}
					});
					upload.send(function(err, data) {
						console.log(err, data);
					});
					fs.writeFile("test.png", img.toPng(), null)
				})
			}, 0)
			break;
	}
});
