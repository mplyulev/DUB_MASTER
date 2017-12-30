import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import 'rxjs/Rx';
import { HostListener } from '@angular/core';
declare var Recorder: any;
 
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
    
   
   public singleTrackPlayButtons = [];
   public trackId = 0;
    public isMetronomePlaying = false;
    public undecodedBuffers = [];
   public wholeTrackArray = []
   public isStopped = false;
   public timeWhenStopped :any;
   public bigLoops = [];
    public decodedAudioRecord = [];
   public soundsBufferAudio = []; 
   public audioSources = []; 
   public playingNodes = [];
   public loopClockHelperVariable;
   public isRecording = false;
   public recordStarted;
   public progressFillWidth = 0;
  constructor(private http:Http) {}
  
   ngOnInit (){ 
    
     
   }
   

   ngAfterContentInit () {
    
   }
}
 
   

 
 
 