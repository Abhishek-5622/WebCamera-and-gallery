// ***********************************************JAVASCRIPT CODE********************************

//Store Reference
let videoPlayer = document.querySelector("video");
let vidRecordBtn = document.querySelector("#record-video");
let captureBtn=document.querySelector("#click-picture");
let zoomInBtn = document.getElementById('in');
let zoomOutBtn = document.getElementById('out');
let allFilters = document.querySelectorAll('.filter');

//create constraints => hardware device
let constraints = { video: true, audio: true };

//mediaRecorder => for recording
let mediaRecorder;

//create array to add data
let chunks = [];

//default value od scale ( used in zoom in and out)
let currZoom =1;

//filter color shade
let filter = '';

//set state of recording
let recordState = false;

//click on zoom in
zoomInBtn.addEventListener('click',function(){
  //get current scale value 
  let vidScale = Number(
      videoPlayer.style.transform.split("(")[1].split(")")[0]
  )
  // if video scale is less than 3 then is scale value change by 0.4
  if(vidScale<3)
  {
      currZoom = vidScale+0.4;
      videoPlayer.style.transform=`scale(${currZoom})`;
  }
  else{
    alert("More zoom in is not possible in this image.....")
  }
});

//click on zoom out
zoomOutBtn.addEventListener('click',function(){
  //get current scale value 
  let vidScale = Number(
      videoPlayer.style.transform.split("(")[1].split(")")[0]
  )
  // if video scale is more than 1 then is scale value change by 0.4
  if(vidScale>1)
  {
      currZoom = vidScale-0.4;
      videoPlayer.style.transform=`scale(${currZoom})`;
  }
  else{
    alert("More zoom out is not possible in this image.....")
  }
});

//for loop to get all filter
for(let i=0;i<allFilters.length;i++)
{
  //click on filter
    allFilters[i].addEventListener('click',function(e){
      //get current filter background
        filter = e.currentTarget.style.backgroundColor;
        //remove previous filter if any 
        removeFilter();
        //add new filter
        addFilterToScreen(filter);
    })
}

//add filter
function addFilterToScreen(filterColor)
{
  //create div
    let filter = document.createElement('div');
    //add class
    filter.classList.add('on-screen-filter');
    //set height and width
    filter.style.height='100vh';
    filter.style.width='100vw';
    //set background
    filter.style.backgroundColor=`${filterColor}`;
    //set position to fixed
    filter.style.position = 'fixed';
    //set top
    filter.style.top= '0px';
    //append child
    document.querySelector('body').appendChild(filter);
}

//remove filter
function removeFilter(){
    let el = document.querySelector('.on-screen-filter');
    //if previous filter applied then remove filter
    if(el)
    {
        el.remove();
    }
}

//click on record button 
vidRecordBtn.addEventListener("click",function(){
  if(mediaRecorder!=undefined)
  {
      removeFilter();
      let innerDiv = vidRecordBtn.querySelector('#record-div');
  if(recordState==false)
  {
      recordState=true;
      innerDiv.classList.add('recording-animation');
      currZoom=1
      videoPlayer.style.transform = `scale(${currZoom})`
      mediaRecorder.start();
  }
  else{
      recordState=false;
      innerDiv.classList.remove('recording-animation');
      mediaRecorder.stop();
      
  }
}
})

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
  let innerDiv = captureBtn.querySelector('#click-div');
  //add class
    innerDiv.classList.add('capture-animation');
    //click picture
    capture();
  //after 1 sec remove animation
    setTimeout(function(){
        innerDiv.classList.remove('capture-animation');
    },1000);
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
  //origin shifting
  tool.translate(c.width/2,c.height/2);
  //scaling
  tool.scale(currZoom,currZoom);
  //moving back the origin
  tool.translate(-c.width/2,-c.height/2);
  //draw image
  tool.drawImage(videoPlayer,0,0);
// if filter is present
  if(filter!='')
  {
      tool.fillStyle = filter;
      tool.fillRect(0,0,c.width,c.height);
  }
  
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