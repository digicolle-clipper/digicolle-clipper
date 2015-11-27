"use babel";

var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
var ipcMain = require('electron').ipcMain;
var screenshot = require('electron-screenshot');

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
	switch (arg) {
		case "showclip":
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
			var rect = JSON.parse(arg);
			var windowPosition = mainWindow.getPosition();
			rect.x -= windowPosition[0];
			rect.y -= windowPosition[1];
			setTimeout(function () {
				mainWindow.capturePage(rect, function(img) {
					fs.writeFile("test.png", img.toPng(), null)
				})
			}, 0)
			break;
	}
});