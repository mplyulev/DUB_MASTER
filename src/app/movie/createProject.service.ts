import {Injectable} from '@angular/core';

@Injectable()
export default class createProjectService {
    public beats;
    public duration;
    public metronomeNode;
    public tempo;
    public projectSettings;
    changeBeatNumber (value) {
        this.beats = value;
        console.log(this.beats)
        this.duration = (60/this.tempo)*this.beats;
       }
    changeMetronomeTempo () {
        this.duration = (60/this.tempo)*this.beats;
        }
    }