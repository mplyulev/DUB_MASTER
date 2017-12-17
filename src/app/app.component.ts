import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import 'rxjs/Rx';

import { Http, ResponseContentType } from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
  
declare var AudioContext;
declare var webkitAudioContext;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
   public sounds: any = ['/assets/WAV/pad.wav',
   '/assets/WAV/bass.wav',
   '/assets/WAV/claps2.wav',
   '/assets/WAV/claps.wav',
   '/assets/WAV/tom.wav',
   '/assets/WAV/guitar1.wav',
   '/assets/WAV/guitar2.wav',
   '/assets/WAV/highhat1.wav',
   '/assets/WAV/highhat2.wav',
   '/assets/WAV/highhat3.wav',
   '/assets/WAV/tom.wav',
   '/assets/WAV/Shakers/Crude_Shaker_PL.wav',
   '/assets/WAV/Kicks XXL/Devil_Kick_PL.wav',
   '/assets/WAV/Kicks XXL/Chokka_Kick_PL.wav', 
   '/assets/WAV/Snares/Clamatic_Snare_PL.wav',
   '/assets/WAV/Snares/Beatbox_Snare_PL.wav',
   '/assets/WAV/Snares/Basic_Snare_PL.wav',
   '/assets/WAV//Snares/Animal_Snare_PL.wav',
   '/assets/WAV/Snares/Aero_Snare_PL.wav',
   '/assets/WAV/Snares/Aco_Snare_PL.wav', ];
    

    public undecodedBuffers = [];
   public wholeTrackArray = []
   public isStopped = false;
   public timeWhenStopped :any;
   public bigLoops = [];
    public decodedAudioRecord = [];
   public soundsBufferAudio = [];
   public audioSources = [];

  constructor(private http:Http) {}
   ngOnInit (){ 
     this.loadSounds();
   
   }
  audioContext = new AudioContext();


play(sound) {
    let that = this;
    let fileName = sound.substring(sound.lastIndexOf("/")+1,sound.lastIndexOf(".wav"));
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    that.http.get(sound, options)
    .map(r => r.arrayBuffer())
    .subscribe((soundBuffer) => {
        that.audioContext.decodeAudioData(soundBuffer, (buffer) => {
            let soundBufferRecord = buffer;
            let source = that.audioContext.createBufferSource(); 
            source.buffer = buffer;
            soundBufferRecord.startTime = that.audioContext.currentTime;
            that.undecodedBuffers.push(soundBufferRecord);
            source.connect(that.audioContext.destination);       
            source.start(0); 
        })  
    }
)}

playBigLoop() {
    var that = this;
    that.undecodedBuffers.forEach(function (soundBufferRecord) {
        let source = that.audioContext.createBufferSource(); 
        source.buffer = soundBufferRecord;
        // if (that.isStopped) { 
        //     source.buffer.startTime = source.buffer.startTime - that.timeWhenStopped;
        // } 
        source.connect(that.audioContext.destination);
        source.start(that.audioContext.currentTime + source.buffer.startTime);  
});
  
        
   
}

startMetronome() {
    let nextNoteTime = 0;
    for (var index=0;index<4; index ++ ) {
        var osc = this.audioContext.createOscillator();
        osc.connect( this.audioContext.destination );
        osc.start(nextNoteTime);
        nextNoteTime+=1;
        osc.stop(nextNoteTime - 0.9);
}
}
 
startRecord() {
    let that = this;
    let startTime = that.audioContext.currentTime;
    this.startMetronome() 
}
    // let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    // let url = '/assets/WAV/Shakers/Crude_Shaker_PL.wav'
    // for (var index=0;index<4; index ++ ) {
    //     that.http.get(url, options)
    //     .map(r => r.arrayBuffer())
    //     .subscribe((soundBuffer) => {
            
    //         that.audioContext.decodeAudioData(soundBuffer, (buffer) => {
    //             console.log('test');
    //             let source = that.audioContext.createBufferSource(); 
    //             source.buffer = buffer;
    //             source.connect(that.audioContext.destination);
    //             console.log(that.audioContext.currentTime)
    //             source.start(that.audioContext.currentTim);
    //         }
    //     )}
    // )}
 
 

 stopRecord() {
    this.bigLoops.push(this.decodedAudioRecord);  
    this.decodedAudioRecord = []; 
    this.timeWhenStopped = this.audioContext.currentTime;
    this.isStopped = true;  
 }
 

 

 loadSingleSound(sound) {
    let that = this;
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    that.http.get(sound, options)
    .map(r => r.arrayBuffer())
    .subscribe((soundBuffer) =>  soundBuffer)
 }
 
 loadSounds(){
     
    let that = this;
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    this.sounds.forEach(function(sound) {
        let fileName = sound.substring(sound.lastIndexOf("/")+1,sound.lastIndexOf(".wav"));
        that.http.get(sound, options)
        .map(r => r.arrayBuffer())
        .subscribe((soundBuffer) => {
            let soundBufferAndTitle = {
                soundBuffer: soundBuffer,
                title: fileName
            }
            that.soundsBufferAudio.push(soundBufferAndTitle)
        }  
    );
    })
 }
}
 