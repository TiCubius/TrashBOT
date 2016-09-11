// TM/discord/lib/discord_bot.js
// VERSION 2.01/11.09.2016
// AUTHOR: TiCubius

var fs = require("fs")
var lame = require("lame")
var recursive = require('recursive-readdir')

var isPlaying
var stopPlaying
var songRequest = []
var musicFolder = "YOUR MUSIC FOLDER HERE"

module.exports.addMusic  = (Client, e) => {
  var dirname = e.message.content.split(" ")[1]
  if (dirname === undefined || !fs.existsSync(musicFolder + dirname) || !fs.lstatSync(musicFolder + dirname).isDirectory()) { return false }

  recursive(musicFolder + dirname, (err, files) => {
    files.forEach((filepath) => {
      console.log("Added: " + filepath)
      songRequest.push(filepath)
      songRequest = shuffleArray(songRequest)
    })
  })

  e.message.reply("[BOT] - Playlist: " + dirname + " added !")
}
module.exports.playMusic = (Client, e) => {
  if (isPlaying && !stopPlaying) { return true }
  if (songRequest.length == 0) {
    isPlaying = false
    stopPlaying = true
    return false
  }

  play(Client, e, songRequest[0])
}
module.exports.skipMusic = (Client, e) => {
  if(isPlaying){
    this.stopMusic(Client, e)

    e.message.channel.sendMessage("```[BOT] - Skipped: " + songRequest[0].replace(musicFolder, "") + ".```")
    songRequest.shift()

    this.playMusic(Client, e)
  }
}
module.exports.stopMusic = (Client, e) => {
  stopPlaying = true
  isPlaying = false
}
module.exports.clearAll  = (Client, e) => {
  songRequest = []
  e.message.channel.sendMessage("[BOT] - Cleared Music Queue.")
}

function play(Client, e, filepath) {
  isPlaying = true
  stopPlaying = false

  // I HAVE NO IDEA FROM NOW ON
  var voiceConnectionInfo = Client.VoiceConnections[0]
  var mp3decoder = new lame.Decoder()
  mp3decoder.on("format", decode)
  fs.createReadStream(filepath).pipe(mp3decoder)

  function decode(pcmfmt) {
    var options = {
      frameDuration: 60,
      sampleRate: pcmfmt.sampleRate,
      channels: pcmfmt.channels,
      float: false,

      multiThreadedVoice: true
    };

    var readSize = pcmfmt.sampleRate / 1000 * options.frameDuration * pcmfmt.bitDepth / 8 * pcmfmt.channels;

    mp3decoder.once("readable", () => {
      var voiceConnection = voiceConnectionInfo.voiceConnection;
      var encoder = voiceConnection.getEncoder(options);
      encoder.setVolume("5")

      const needBuffer = () => encoder.onNeedBuffer();
      encoder.onNeedBuffer = () => {
        var chunk = mp3decoder.read(readSize);
        var sampleCount = readSize / pcmfmt.channels / (pcmfmt.bitDepth / 8);
        if (stopPlaying) return;

        if (!chunk) return setTimeout(needBuffer, options.frameDuration);
        encoder.enqueue(chunk, sampleCount)
      };

      needBuffer();
    });

    mp3decoder.once('end', () => {
      if (stopPlaying) return;
      songRequest.shift()
      setTimeout(play, 100, Client, e, songRequest[0]);
    });
  }
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
