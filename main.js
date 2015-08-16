var fs = require('fs');
var ytdl = require('ytdl-core');
var http = require('http');
var ffmpeg   = require('fluent-ffmpeg');
var spawn = require("child_process").spawn;
var process = spawn('python', [__dirname + "\\bin\\server.py"]);

var app = require('app');
var BrowserWindow = require('browser-window');

//require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    process.kill();
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1024, height: 768});
  mainWindow.setMenu(null);

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  var server = http.createServer(function (req, res) {
    args = req.url.slice(1).split("/");
    if(args[0] == "play") {
      ytdl('http://www.youtube.com/watch?v='+args[1])
        .pipe(res);
    } else {
      var stream = fs.createWriteStream(__dirname + "/music/"+ decodeURI(args[1]) +".mp3");
      stream.on("finish", function() {
        res.end("done");
      });
      var proc = new ffmpeg({source: ytdl('http://www.youtube.com/watch?v='+args[2])});
      proc.setFfmpegPath(__dirname + "/bin/ffmpeg/ffmpeg.exe");
      proc.toFormat("mp3").pipe(stream);
    }
  });
  server.listen(8000, '127.0.0.1');

  mainWindow.on('closed', function() {
    process.kill();
    mainWindow = null;
  });
});
