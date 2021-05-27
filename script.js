// ***********************************************JAVASCRIPT CODE********************************

//Store Reference
let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");
let captureBtn=document.querySelector("#click-picture");

//create constraints => hardware device
let constraints = { video: true, audio: true };
//mediaRecorder => for recording
let mediaRecorder;
//create array to add data
let chunks = [];
//set state of recording
let recordState = false;

//click on record button 
vidRecordBtn.addEventListener("click", function () {

  if(mediaRecorder!=undefined)
 {
  if (!recordState) {
    recordState = true;
    mediaRecorder.start();
    vidRecordBtn.innerText = "Recording...";
  } else {
    recordState = false;
    mediaRecorder.stop();
    vidRecordBtn.innerText = "Record";
  }
}
});

//mediaDevices => help in access the device
//getUserMedia is a function => provide permission
// it is a promise
navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  //add source to video
  videoPlayer.srcObject = mediaStream;
  // create object of MediaRecorder
  mediaRecorder = new MediaRecorder(mediaStream);
  //when some amount of recording complete => event ondataavailable occur => add some data in chunk array
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
//when recording complete => onstop event occur => file download
  mediaRecorder.onstop = function () {
    //blob = > immutable file and written in binary ya text(Readable)
    //create object of blob
    let blob = new Blob(chunks, { type: "video/mp4" });
    //array get empty for new files
    chunks = [];
    //create url
    var blobUrl = URL.createObjectURL(blob);
    // create anchore tag
    var link = document.createElement("a");
    //set href attributes
    link.href = blobUrl;
    //set downoad attribute => name of file with extension
    link.download = `${Date.now()}.mp4`;
    //click on anchore tag
    link.click();
    //remove anchore tag
    link.remove();
  };
});

//click on click button
captureBtn.addEventListener('click',function()
{
  capture();
})

//click pand download photo
function capture()
{
  //create canvas tag
  let c = document.createElement('canvas');
  //set width an height
  c.width=videoPlayer.videoWidth;
  c.height=videoPlayer.videoHeight;
  //create tool
  let tool = c.getContext('2d');
  //draw image
  tool.drawImage(videoPlayer,0,0);
  //create anchore tag
  let link =document.createElement('a');
  //add download attribute
  link.download='image.png';
  //add href
  link.href=c.toDataURL();
  //click on anchore
  link.click();
  //remove anchore
  link.remove();
  //remove canvas
  c.remove();
}