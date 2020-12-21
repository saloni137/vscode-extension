var video = document.querySelector("#video");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err0r) {
            console.log("Something went wrong!");
        });
}


var video = document.querySelector("#video");
var name = document.querySelector("#name");
const mediaStream = new MediaStream();
mediaStream.addTrack(stream.track);
video.srcObject = mediaStream;
name.innerHTML = participant.displayName;