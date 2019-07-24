var videoArray = new Array();
var history = new Array();
var player;

function playInit(){
    var xmlhttp = new XMLHttpRequest();
    var url = "ytList.json";

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            videoArray = JSON.parse(this.responseText);
            document.getElementById("vidConsole").innerHTML = videoArray.length;
            document.getElementById("vidConsole").innerHTML += " Videos in Array";
            playLoop();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function onYoutubeIframeAPIReady() {
    playLoop();
}

function playLoop() {//fetch older videos
    var video = videoArray[randomInt(videoArray.length)];
    player = new YT.Player('ytList', {
        height: '270',
        width: '480',
        videoId: video.videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
    displayLog(video);
}

function onPlayerReady(event) {
    event.target.playVideo();
}
function onPlayerStateChange(event) {
    
}

function stopVideo() {
    player.stopVideo();
}

function displayLog(video) {
    var arrayLength = videoArray.length;
    document.getElementById("returner").innerHTML = "Playing!";
    document.getElementById("vidConsole").innerHTML += 'Playing: <a href="http://www.youtu.be/';
    document.getElementById("vidConsole").innerHTML += video.videoId;
    document.getElementById("vidConsole").innerHTML += '">';
    document.getElementById("vidConsole").innerHTML += video.videoId;
    document.getElementById("vidConsole").innerHTML += '</a><br />';
    document.getElementById("vidConsole").innerHTML += video.videoDate;
    document.getElementById("vidConsole").innerHTML += "<br />";

}
//ty thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
function saveTextAsFile()
{
    var textToSave = JSON.stringify(videoArray);
    var textToSaveAsBlob = new Blob([textToSave], {type:"application/json"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}
 
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    document.getElementById("inputToken").value = fileToLoad.name.substr(0,fileToLoad.name.indexOf('.'));
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        loadedArray = JSON.parse(fileLoadedEvent.target.result);
        //document.getElementById("returner2").innerHTML = loadedArray.length;
        //document.getElementById("returner2").innerHTML += " Videos Loaded!";
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

function randomInt(high) {//ty https://blog.tompawlak.org/generate-random-values-nodejs-javascript
    return Math.floor(Math.random() * high);
}