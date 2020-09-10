import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  lastTrail=null;
  events = ['touch','mouse'];
  event = 0;
  options:any={
    eventType:'touch',
    maxInterpolatedDots: 70,
    freezeOnEnd: false,
    maxTrailElements: 80
  };

  constructor(){}

  setLastTrail(event) {
    this.lastTrail = event;
  }
  changeValue(event,type,format='number'){
    let value = event;
    if(format=='number'){
      value = parseInt(event.target.value);
    }
    this.options[type]=value;
    const options = Object.assign(this.options);
    this.options = {};
    setTimeout(()=>{
      this.options = options;
    })
  }
  togleFreeze() {
    this.changeValue(!this.options.freezeOnEnd,'freezeOnEnd','boolean')
  }
  togleEvent() {
    this.event = this.event? 0 : 1;
    this.changeValue(this.getEvent(),'eventType','string');
    if(this.event == 1) {
      this.changeValue(false,'freezeOnEnd','boolean')
    }
  }
  private getEvent(){
    return this.events[this.event];
  }
}
