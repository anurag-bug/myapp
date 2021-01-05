import { Component } from '@angular/core';
declare var MediaRecorder: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // declare var MediaRecorder: any;
  title = 'my-app';

  recordedChunks = []


  logElem = document.getElementById("log");

  displayMediaOptions = {
    video: {
      cursor: "always"
    },
    audio: true
  };


  async startCapture() {
    // this.logElem.innerHTML = "";

    try {
      let videoElem = <HTMLVideoElement>document.getElementById("video");
      let audioElem = <HTMLVideoElement>document.getElementById("audio");
      const mediaDevices = navigator.mediaDevices as any;
      videoElem.srcObject = await mediaDevices.getDisplayMedia(this.displayMediaOptions);
      // audioElem.srcObject = 
      this.record()
      // dumpOptionsInfo();
    } catch (err) {
      console.error("Error: " + err);
    }
  }

  stopCapture(evt) {
    let videoElem = <HTMLVideoElement>document.getElementById("video");
    let tracks = (<any>videoElem.srcObject).getTracks();

    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
    // this.download();
  }

  record() {
    let that = this;

    let handleDataAvailable = (event) => {
      // let self = this;
      console.log("data-available");
      if (event.data.size > 0) {
        that.recordedChunks.push(event.data);
        console.log(that.recordedChunks);
        this.download();
      } else {
        // ...
      }
    }

    let canvas = document.querySelector("video");

    // Optional frames per second argument.
    let stream = (<any>canvas).captureStream(25);
    this.recordedChunks = [];

    console.log(stream);
    let options = { mimeType: "video/webm; codecs=vp9" };
    let mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();


  }


  download() {
    var blob = new Blob(this.recordedChunks, {
      type: "video/webm"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
