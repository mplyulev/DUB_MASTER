import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import 'rxjs/Rx';
import { HostListener } from '@angular/core';
import createProjectService from '../movie/createProject.service';
import { Http, ResponseContentType } from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import { NouisliderModule } from 'ng2-nouislider';   
declare var AudioContext;
declare var webkitAudioContext;
@Component({
  selector: 'app-root',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})

export class LooperComponent {
   
   public sounds: any = [ 
   '/assets/kits/boon.wav',
   '/assets/kits/break.wav',
   '/assets/kits/clap1.wav',
   '/assets/kits/clap2.wav',
   '/assets/kits/fx1.wav',
   '/assets/kits/fx2.wav',
   '/assets/kits/hand1.wav',
   '/assets/kits/hand2.wav',
   '/assets/kits/hat.wav',
   '/assets/kits/kick1.wav',
   '/assets/kits/snare1.wav',
   '/assets/kits/snare2.wav',
   '/assets/kits/vox_hey1.wav', 
   '/assets/kits/vox_hey2.wav',
   '/assets/kits/vox_what.wav',
   '/assets/kits/wood.wav',
   '/assets/kits/rhodes1.wav',
   '/assets/kits/rhodes2.wav',
   '/assets/kits/rhodes3.wav',
   '/assets/kits/rhodes4.wav',
   '/assets/kits/rhodes5.wav',
   '/assets/kits/rhodes6.wav',
   '/assets/kits/rhodes7.wav',
   '/assets/kits/rhodes8.wav',
   '/assets/kits/rhodes9.wav',
   '/assets/kits/rhodes10.wav',
   '/assets/kits/bass1.wav', 
   '/assets/kits/bass2.wav',
   '/assets/kits/bass3.wav',
   '/assets/kits/bass4.wav',
   '/assets/kits/bass6.wav',
   '/assets/kits/bass7.wav',
   '/assets/kits/bass8.wav',
   '/assets/kits/bass9.wav',
   '/assets/kits/bass1.wav',];

     

public singleTrackPlayButtons = [];
public trackId = 0;
public isMetronomePlaying = false;
public undecodedBuffers = [];
public isStopped = false;
public timeWhenStopped :any;
public decodedAudioRecord = [];
public soundsBufferAudio = []; 
public audioSources = []; 
public playingNodes = [];
public loopClockHelperVariable;
public isRecording = false;
public recordStarted;
public progressFillWidth = 0;
public tempo = this.createProjectService.tempo;
public beats = this.createProjectService.beats;
public duration = this.createProjectService.duration;
constructor(private http:Http, private createProjectService: createProjectService) {}
ngOnInit (){ 
this.loadSounds();
}

public projectSettings;
audioContext = new AudioContext();
public mainVolumeNode = this.audioContext.createGain();
 
public metronomeNode = this.audioContext.createBufferSource(); 
public keyCode;
public pressedButton: string = '';
@HostListener('document:keydown', ['$event'])
public handleKeyboardEvent(event: KeyboardEvent): void {
    let that = this;
     this.keyCode = event.keyCode;
 
    if (this.keyCode === 106) {
        this.startRecord();
    }
    if (this.keyCode === 32) {
        this.playBigLoop();
    }
    if (this.keyCode === 111) {
        this.handleMetronome();
    }
    for (let index=0; index<that.soundsBufferAudio.length; index++) {
        let soundKeyCode = that.soundsBufferAudio[index].keyCode;

        if (this.keyCode == soundKeyCode) {
             that.play(that.soundsBufferAudio[index]);
        }
    }
}

public isAllStopped: Boolean;
 
play(sound) {
    var startTime  = this.audioContext.currentTime;
 
    var recordStarted = this.recordStarted;
    var source = this.audioContext.createBufferSource();
    if (this.isRecording) {
        this.undecodedBuffers.push({sound:sound.soundBuffer,startTime:startTime,trackId:this.trackId,recordStarted:recordStarted});
    }
    source.buffer = sound.soundBuffer;
    this.mainVolumeNode.connect(this.audioContext.destination);
    source.connect(this.mainVolumeNode);       
    source.start(0); 
}
 
 
startMetronome () {
    var that = this;
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    that.http.get('/assets/WAV/Shakers/Crude_Shaker_PL.wav', options)
    .map(r => r.arrayBuffer())
    .subscribe((soundBuffer) => {
        that.audioContext.decodeAudioData( soundBuffer,(buffer) => {
            that.metronomeNode = this.audioContext.createBufferSource(); 
            that.metronomeNode.buffer = buffer;
            that.metronomeNode.connect(that.audioContext.destination);
            that.metronomeNode.start();
            that.metronomeNode.loop = true;
            that.metronomeNode.loopEnd =(60/that.tempo);
        })  
    });
}

changeVolume(volume) {
    this.mainVolumeNode.gain.value = volume/100;
    console.log(volume);
    console.log( this.mainVolumeNode.gain.value)
}

stopMetronome () {
this.metronomeNode.stop();
}

handleMetronome () {
    if (this.isMetronomePlaying) {
        this.isMetronomePlaying = false;
        this.stopMetronome()
    } else {
        this.isMetronomePlaying = true;
        this.startMetronome()
    }
}

stopAllSounds () {
    this.isAllStopped = true;
    for (let index=0; index<this.playingNodes.length; index++) {
        this.playingNodes[index].source.stop(0);
        
    }
}

playBigLoop() {     
    let that = this;  
    this.handleLooperClock();
    that.undecodedBuffers.forEach(function (buffer) {
        let soundBuffer = buffer.sound;
        let currentSoundTrackId = buffer.trackId;
        let startTime = buffer.startTime - buffer.recordStarted;
        var recordStarted = buffer.recordStarted;
        let sampleRate = soundBuffer.sampleRate;
        let bufferExtendedDuration =  that.audioContext.createBuffer(1, that.duration*sampleRate, sampleRate);  
        let arrayBufferExtended =  soundBuffer.getChannelData(0);
        bufferExtendedDuration.getChannelData(0).set(arrayBufferExtended);
        bufferExtendedDuration.trackId = currentSoundTrackId;
        if (bufferExtendedDuration.trackId == that.trackId || that.isAllStopped) {
            let source = that.audioContext.createBufferSource(); 
            source.buffer = bufferExtendedDuration;      
            that.mainVolumeNode.connect(that.audioContext.destination)
            source.connect( that.mainVolumeNode)
            source.start(that.audioContext.currentTime +  startTime); 
            source.loop = true;  
            that.playingNodes.push({source:source,trackId:currentSoundTrackId,isPlaying: true}); 
        } 
    });
    that.isAllStopped = false;
}

playLittleLoop (buttonId) {
    let that = this;  
    that.undecodedBuffers.forEach(function (buffer) {
        let soundBuffer = buffer.sound;
        let currentSoundTrackId = buffer.trackId;
        let startTime = buffer.startTime - buffer.recordStarted;
        var recordStarted = buffer.recordStarted;
        let sampleRate = soundBuffer.sampleRate;    
        let bufferExtendedDuration =  that.audioContext.createBuffer(1, that.duration*sampleRate, sampleRate);  
        let arrayBufferExtended =  soundBuffer.getChannelData(0);
        bufferExtendedDuration.getChannelData(0).set(arrayBufferExtended);
        bufferExtendedDuration.trackId = currentSoundTrackId;
        if (buffer.trackId == buttonId) {
            let source = that.audioContext.createBufferSource(); 
            source.buffer = bufferExtendedDuration;      
            source.connect(that.audioContext.destination);      
            source.start(that.audioContext.currentTime +  startTime); 
            source.loop = true;  
            that.playingNodes.push({source:source,trackId:currentSoundTrackId,isPlaying: true}); 
        } 
    });
    for ( let index = 0 ; index<that.singleTrackPlayButtons.length; index++){ 
        if (that.singleTrackPlayButtons[index].trackId === buttonId) {
            that.singleTrackPlayButtons[index].isPlaying = true;
        }
    }
}
 
startRecord() {
    this.trackId+=1;
    this.handleRecordClock();
}

handleLooperClock () {
    let that = this;
    let loopStarted = this.audioContext.currentTime;
    that.loopClockHelperVariable = loopStarted;
    var clockInterval = setInterval (function () {   
        if (that.isAllStopped) {
            clearInterval(clockInterval);
        }
        if (that.audioContext.currentTime - loopStarted < that.duration ) {  
           that.progressFillWidth = ((that.audioContext.currentTime - loopStarted)/that.duration) * 100; 
        }  else {
             loopStarted = that.audioContext.currentTime;
             that.loopClockHelperVariable = loopStarted;
        }
    },10)
}

handleRecordClock () {
    let that = this;
    let timeout = that.duration - (that.audioContext.currentTime - that.loopClockHelperVariable);
    setTimeout(function() {
        that.isRecording = true;
        let loopStarted = that.audioContext.currentTime;
        that.singleTrackPlayButtons.push({trackId:that.trackId,isPlaying:true});
        that.recordStarted = that.audioContext.currentTime;  
        var clockInterval = setInterval (function () {   
            if (that.audioContext.currentTime - loopStarted < that.duration ) {
               that.progressFillWidth = ((that.audioContext.currentTime - loopStarted)/that.duration) * 100; 
             }  else {
                that.playBigLoop();
                loopStarted = that.audioContext.currentTime;
                that.isRecording = false;   
                clearInterval(clockInterval);
             }
        },10)
    },timeout*1000);
}

public currentTrackId: number;
stopRecordedTrack (buttonId) {
    var that = this;
    this.currentTrackId = buttonId;
    for ( let index = 0 ; index<that.singleTrackPlayButtons.length; index++){ 
        if (that.singleTrackPlayButtons[index].trackId === buttonId) {
            that.singleTrackPlayButtons[index].isPlaying = false;
        }
    }
    for( let index = 0; index<that.playingNodes.length;index++) {
        if (that.playingNodes[index].trackId == buttonId) {
            that.playingNodes[index].source.stop();  
            that.playingNodes[index].isPlaying = false;
        }
    } 
}

stopRecord() {
    this.timeWhenStopped = this.audioContext.currentTime;
    this.isStopped = true;  
    this.stopAllSounds();
 }
 
loadSounds(){
   let keyCode = 65
    let that = this;
    let options = new RequestOptions({responseType: ResponseContentType.ArrayBuffer});
    this.sounds.forEach(function(sound) {
        let fileName = sound.substring(sound.lastIndexOf("/")+1,sound.lastIndexOf(".wav"));
        that.http.get(sound, options)
        .map(r => r.arrayBuffer())
        .subscribe((soundBuffer) => {
            that.audioContext.decodeAudioData( soundBuffer,(buffer) => {
                let key = String.fromCharCode(keyCode)
                let soundBufferAndTitle = {
                    soundBuffer: buffer,
                    keyCode: keyCode,
                    key: key,
                    title: fileName, 
                }
                keyCode+=1;
                that.soundsBufferAudio.push(soundBufferAndTitle)    
            });
            }  
        );
    })
}
}
 