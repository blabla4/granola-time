var playlist = [];

$("#search").on("input", function() {
  search($("#search").val());
});

addControls();

function playNext() {
  if(playlist.length) {
    play(playlist[0][1], playlist[0][0]);
    playlist.splice(0,1);
  }
  playlistManager();
}

function playlistManager() {
  if($("#list").children().length) {
    $("#list").empty();
  }
  playlist.forEach(function(video) {
    $("<li/>", {text: video[1]}).appendTo("#list");
  });
}

function play(title, id) {
  $("#video").remove();
  $("#title").text(title);
  var video = $("<video/>", {id:"video", autoplay:"true"}).appendTo(document.body);
  video.hide();
  $("<source/>", {type:"video/mp4", src:"http://localhost:8000/play/"+id}).appendTo(video);
  video.on("ended", function() {
    playNext();
  });
  video.on("timeupdate", function() {
    var percent = 100-Math.round((((this.duration - this.currentTime) / this.duration))*100);
    $("#timebar").css("background", "linear-gradient(to right, rgb(100,100,100) "+percent+"%, rgb(40,40,40) "+percent+"%)");
  });
}

function addControls() {
  var playBtn = $("<button/>", {class: "controls-elt", text: "Play"}).appendTo("#controls");
  playBtn.on("click",function(){
    $("#video").get(0).play();
  });
  var pauseBtn = $("<button/>", {class: "controls-elt", text: "Pause"}).appendTo("#controls");
  pauseBtn.on("click",function(){
    $("#video").get(0).pause();
  });
  var timebar = $("<div/>", {id: "timebar", class:"controls-elt"}).appendTo("#controls");
  timebar.css("background", "linear-gradient(to right, rgb(100,100,100) 0%, rgb(40,40,40) 0%)");
  var playlistBtn = $("<button/>", {text: "Playlist"}).appendTo("#controls");
  playlistBtn.on("click", function() {
    if($("#playlist").is(":visible")) {
      $("#playlist").hide();
    } else {
      $("#playlist").show();
    }
  });
}

function addPlaylist(title, id) {
  $("#add-btn-" + id).css("color", "rgb(100,100,100)");
  $("#add-btn-" + id).css("border", "2px solid rgb(100,100,100)");
  playlist.push([id, title]);
  playlistManager();
}

function download(title, id) {
  $.get("http://localhost:8000/dl/"+title+"/"+id, function() {
    $("#dl-btn-" + id).css("color", "rgb(100,100,100)");
    $("#dl-btn-" + id).css("border", "2px solid rgb(100,100,100)");
  });
}

function showResults(results) {
  results.forEach(function(video) {
    var resultDiv = $("<div/>", {class:"result"});

    var playBtn = $("<button/>", {class:"elt play", text:"Play"}).appendTo(resultDiv);
    playBtn.on("click", function() {
      play(video.title, video.id);
    });

    var addBtn = $("<button/>", {
      id: "add-btn-" + video.id,
      class:"elt add",
      text: "+"
    }).appendTo(resultDiv);
    addBtn.on("click", function() {
      addPlaylist(video.title, video.id);
    });

    var dlBtn = $("<button/>", {
      id: "dl-btn-" + video.id,
      class: "elt dl",
      text: "Download"
    }).appendTo(resultDiv);
    dlBtn.on("click", function() {
      download(video.title, video.id);
    });

    $("<span/>", {class:"elt", text:video.title}).appendTo(resultDiv);

    resultDiv.appendTo("#results");
  });
}

function search(query) {
  $.get("http://localhost:5000/api/search/" + query, function(data) {
    var results = JSON.parse(data);
    if($("#results").children().length) {
      $("#results").empty();
    }
    showResults(results);
  });
}
