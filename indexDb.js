//create request => create ya open database
let request = indexedDB.open('Camera',1);
//database
let db;
//on success
request.onsuccess=function(e)
{
    //store request result in database
    db = request.result;
}
//on error
request.onerror=function(e)
{
    //error
    console.log('error');
}
//on upgrade
request.onupgradeneeded =function(e)
{
    //store request result in database
    db = request.result;
    //create objectStore(like a table)
    // keyPath => primary key
    db.createObjectStore('gallery',{keyPath:'mId'});

}
//add items in store
function addMediaToGallery(data,type)
{
    //create transaction
    let tx = db.transaction('gallery','readwrite');
    //get gallery
    let gallery = tx.objectStore('gallery');
    //add items in gallery
    gallery.add({mId:Date.now(),type,media:data});
}

// function that is used to view img n video that are present in db to gallery
function viewMedia()
{
    //get body
    let body = document.querySelector('body');
    //set transaction
    let tx = db.transaction('gallery','readonly');
    //set gallery store
    let gallery = tx.objectStore('gallery');
    //request
    let req = gallery.openCursor();
    //on success
    req.onsuccess=function()
    {
        //get cursor
        let cursor = req.result;
        // is cursor present
        if(cursor)
        {
            //if media is video
            if(cursor.value.type=='video')
            {
                //create div of video container
                let vidContainer = document.createElement('div');
                //set attribute => used to find uniquely
                vidContainer.setAttribute('data-mId',cursor.value.mId);
                //add class
                vidContainer.classList.add('gallery-vid-container');
                //create video
                let video = document.createElement('video');
                //append
                vidContainer.appendChild(video);
                //create button
                let deleteBtn = document.createElement('button');
                //add class
                deleteBtn.classList.add('gallery-delete-button');
                //set inner text
                deleteBtn.innerText='Delete';
                //addevent listener of click
                deleteBtn.addEventListener('click',deleteBtnHandler);
                //create button
                let downloadBtn = document.createElement('button');
                //add class
                downloadBtn.classList.add('gallery-download-button');
                //set inner text
                downloadBtn.innerText='Download';

                downloadBtn.addEventListener('click',downloadBtnHandler);
                //append
                vidContainer.appendChild(deleteBtn);
                vidContainer.appendChild(downloadBtn);
                //add controls and autoplay
                video.controls=true;
                video.autoplay= true;
                //add source
                video.src = URL.createObjectURL(cursor.value.media);
                //append to body
                body.appendChild(vidContainer);
            }
            else{
                //create div container
                let imgContainer = document.createElement('div');
                //set attribute => used to find uniquely
                imgContainer.setAttribute('data-mId',cursor.value.mId);
                //add class
                imgContainer.classList.add('gallery-img-container');
                //create img tag
                let img = document.createElement('img');
                //add source
                img.src = cursor.value.media;
                //append
                imgContainer.appendChild(img);
                //create button
                let deleteBtn = document.createElement('button');
                //add class
                deleteBtn.classList.add('gallery-delete-button');
                //set innertext
                deleteBtn.innerText='Delete';
                //addevent listener of click
                deleteBtn.addEventListener('click',deleteBtnHandler);
                //create button
                let downloadBtn = document.createElement('button');
                //add class
                downloadBtn.classList.add('gallery-download-button');
                //set innertext
                downloadBtn.innerText='Download';

                downloadBtn.addEventListener('click',downloadBtnHandler);
                //append
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(downloadBtn);
                //append to body
                body.appendChild(imgContainer);

            }
            //continue 
            cursor.continue();
        }
    }
    
}

//delete from datbase
function deleteMediaFromGallery(mId)
{
    let tx = db.transaction('gallery','readwrite');
    let gallery = tx.objectStore('gallery');
    gallery.delete(Number(mId));
}
//delete from ui and db
function deleteBtnHandler(e)
{
    let mId = e.currentTarget.parentNode.getAttribute('data-mId');
    //delete from db
    deleteMediaFromGallery(mId);
    e.currentTarget.parentNode.remove();
}


function downloadBtnHandler(e)
{
    let mId = e.currentTarget.parentNode.getAttribute('data-mId');
    
    let mediaType = e.currentTarget.parentNode.classList.value.split("-")[1];
    if(mediaType=='img')
    {
        // create anchore tag
  let link =document.createElement('a');
  //add download attribute
  link.download=`${Date.now()}.png`;
  //add href
  link.href= e.currentTarget.parentNode.childNodes[0].getAttribute("src");
  //click on anchore
  link.click();
  //remove anchore
  link.remove();
    }
    else if(mediaType=="vid")
    {
    // create anchore tag
    var link = document.createElement("a");
    //set href attributes
    link.href = e.currentTarget.parentNode.childNodes[0].getAttribute("src");;
    //set downoad attribute => name of file with extension
    link.download = `${Date.now()}.mp4`;
    //click on anchore tag
    link.click();
    //remove anchore tag
    link.remove();
    }
}