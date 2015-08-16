var playlist = [];

$("#search").on("input", function() {
  search($("#search").val());
});

function playlistManager() {
  if(playlist.length) {
    play("todo", playlist[0]);
    playlist.splice(0,1);
  }
}

function play(title,id) {
  $("#video").remove();
  $("#player").text(title);
  var video = $("<video/>", {id:"video", autoplay:"true"}).appendTo(document.body);
  video.hide();
  $("<source/>", {type:"video/mp4", src:"http://localhost:8000/play/"+id}).appendTo(video);
  video.on("ended", function() {
    playlistManager();
  });
}

function addPlaylist(id) {
  $("#add-btn-" + id).css("color", "rgb(100,100,100)");
  $("#add-btn-" + id).css("border", "2px solid rgb(100,100,100)");
  playlist.push(id);
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
      addPlaylist(video.id);
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
