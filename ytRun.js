const VIDLIMIT = 1000001;
const API_KEY = 'API KEY HERE'
var PLAYLISTID = "UUDZBqSP3HyglavqadtsE-bQ";
var vidLimit;
var videoArray = new Array();
var loadedArray = new Array();
var fileString = new String();
//var activeToken = new String();

function ytVideo(vidID, date) {
    this.videoId = vidID;
    this.videoDate = new Date(date);
}

function searchLoop() {//fetch older videos
    clearArray();                                               //clears array
    document.getElementById("returner2").innerHTML = "Working";
    var token;                                                  //fetches last
    if (document.getElementById("inputToken").value.length > 1){//token from 
        token = document.getElementById("inputToken").value;    //input field,
        updateToken(token);                                     //saves for search   
        token = document.getElementById("inputToken").value;
    }                                                          
    if (document.getElementById("vidLimit").value < VIDLIMIT && //
        document.getElementById("vidLimit").value > 0) {        //processes
        vidLimit = videoArray.length + document.getElementById("vidLimit").value;//search limit
    } else {                                                    //input.
        vidLimit = 50 + videoArray.length;                      //default limit:
    }                                                           //50 videos
    
    var request = gapi.client.youtube.playlistItems.list({
        playlistId: PLAYLISTID,
        part: 'snippet',
        fields: 'items(snippet(publishedAt,resourceId/videoId)),nextPageToken',
        maxResults: '50',
        pageToken: token,
    });
    request.execute(onSearchResponse);
}

function loadPlaylist(){
    if (document.getElementById("playlist").value != "") {
        PLAYLISTID = document.getElementById("playlist").value;
        document.getElementById("listName").innerHTML = PLAYLISTID;
    }
}

function updateToken(loadedToken){ //checks if new videos were uploaded since last search
    var request = gapi.client.youtube.playlistItems.list({
        playlistId: PLAYLISTID,
        part: 'snippet',
        fields: 'items(snippet(publishedAt,resourceId/videoId)),nextPageToken',
        maxResults: '50',
        pageToken: loadedToken,
    });
    request.execute(onCheckResponse);
}

function onCheckResponse(response) {
    checkResponse(response);
}

function onSearchResponse(response) {
    showResponse(response);
}

function checkResponse(response) {    
    var lilJSON = response.items;
    lilJSON.forEach(ytListCheck);


    
    if (videoArray.length < 1) {
        var request = gapi.client.youtube.playlistItems.list({
            playlistId: PLAYLISTID,
            part: 'snippet',
            fields: 'items(snippet(publishedAt,resourceId/videoId)),nextPageToken',
            maxResults: '50',
            pageToken: response.nextPageToken,
        });

        request.execute(onCheckResponse);
    }else { 
        videoArray = loadedArray.concat(videoArray);
        document.getElementById("returner1").innerHTML = videoArray.length;
        document.getElementById("returner1").innerHTML += " Videos in Array";
        document.getElementById("inputToken").value = response.nextPageToken;
    }
}

function showResponse(response) {    
    var lilJSON = response.items;
    lilJSON.forEach(ytListSort);
    document.getElementById("returner1").innerHTML = videoArray.length;
    document.getElementById("returner1").innerHTML += " Videos in Array";
    if (videoArray.length+49 < vidLimit) {
        var request = gapi.client.youtube.playlistItems.list({
            playlistId: PLAYLISTID,
            part: 'snippet',
            fields: 'items(snippet(publishedAt,resourceId/videoId)),nextPageToken',
            maxResults: '50',
            pageToken: response.nextPageToken,
        });

        request.execute(onSearchResponse);
    }else { 
        document.getElementById("inputFileNameToSaveAs").value += PLAYLISTID;
        document.getElementById("inputFileNameToSaveAs").value += ".json";
        displayLog();
    }
}

function ytListSort(lilSnip, i, lilJSON) {//sorts thru response, pushes each video onto array
        var video = new ytVideo(lilSnip.snippet.resourceId.videoId ,lilSnip.snippet.publishedAt);
        //response.items[i];
        //video.videoDate = lilSnip.id.videoId;
//      //fileString += '\n';
//      fileString += video.videoId;
//      fileString += video.videoDate;
//      fileString += '\n';
        videoArray.push(video);
//      //fileString += videoArray.length;
//      //fileString += ':';
    
    //fileString += JSON.stringify(lilJSON);

}

function ytListCheck(lilSnip, i, lilJSON) {//sorts thru response, pushes each video onto array
        var video = new ytVideo(lilSnip.snippet.resourceId.videoId ,lilSnip.snippet.publishedAt);
        var lastEntry = loadedArray[loadedArray.length-1];
        if (video.videoDate < lastEntry.videoDate) {
            clearArray();
        } else if (video.videoId == lastEntry.videoId) {
            clearArray();
        } else {
        videoArray.push(video);
        }

}

function displayLog() {
    var arrayLength = videoArray.length;
    document.getElementById("returner2").innerHTML = "Success!";
    document.getElementById("ytList").innerHTML = arrayLength;
    document.getElementById("ytList").innerHTML += " Videos Retrieved<br />";
    document.getElementById("ytList").innerHTML += "First Video Retrieved:";
    document.getElementById("ytList").innerHTML += videoArray[0].videoId;
    document.getElementById("ytList").innerHTML += "<br />-Uploaded at:";
    document.getElementById("ytList").innerHTML += videoArray[0].videoDate;
    document.getElementById("ytList").innerHTML += "<br />Last Video Retrieved:";
    document.getElementById("ytList").innerHTML += videoArray[arrayLength-1].videoId;
    document.getElementById("ytList").innerHTML += "<br />-Uploaded at:";
    document.getElementById("ytList").innerHTML += videoArray[arrayLength-1].videoDate;
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

        document.getElementById("returner2").innerHTML = loadedArray.length;
        document.getElementById("returner2").innerHTML += " Videos Loaded!";
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function clearArray() {
    while (videoArray.length > 0) {
        videoArray.shift();
    }
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
//init
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    gapi.client.setApiKey(API_KEY);
    //searchLoop();
}

function loadArray() {
    if (videoArray.length < loadedArray.length) {
        videoArray = loadedArray;
    } else {
        document.getElementById("returner2").innerHTML = "somethin bigger is already there";
        document.getElementById("ytList").innerHTML = loadedArray.length;
        document.getElementById("ytList").innerHTML += " Videos in Loaded File";
    }
    document.getElementById("returner1").innerHTML = videoArray.length;
    document.getElementById("returner1").innerHTML += " Videos in Array";
    

}

function findDuplicates() {
    videoArray = dedupe(videoArray);
    document.getElementById("returner1").innerHTML = videoArray.length;
    document.getElementById("returner1").innerHTML += " Videos in Array";
}

function dedupe(arr) { //ty http://stackoverflow.com/users/1377002/andy
  return arr.reduce(function (p, c) {

    // create an identifying id from the object values
    var id = [c.videoId, c.videoDate].join('|');

    // if the id is not found in the temp array
    // add the object to the output array
    // and add the key to the temp array
    if (p.temp.indexOf(id) === -1) {
      p.out.push(c);
      p.temp.push(id);
    }
    return p;

  // return the deduped array
  }, { temp: [], out: [] }).out;
}
