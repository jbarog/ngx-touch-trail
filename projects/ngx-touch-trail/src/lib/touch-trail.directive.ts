import { Directive, Renderer2, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, animate, style } from '@angular/animations';
import { TouchTrailConf, EventType } from './touch-trail-conf';
import { TrailDot } from './trail-dot';

const MINRADIOUS = 10;
const DEFAULTOPTS = {
  className: 'touch-trail-dot',
  eventType: 'touch',
  destroyDelay: 400,
  interpolationStep: MINRADIOUS / 2,
  maxInterpolatedDots: 100,
  maxTrailElements: 90,
  color: '#3da4ab',
  clearOnInit: true,
  freezeOnEnd: false,
  animationMeta: (index, options) => {
    const radious = 30 * (index + 1) / (index + 10)//create an initial growing effect
    return [
      style({
        'background': options.color,
        'border-radius': '50%',
        'height': radious + 'px',
        'box-shadow': '0px 0px 6px ' + options.color,
        'position': 'fixed',
        'transform': 'translate(-50%)',
        'width': radious + 'px'
      }),
      animate(options.destroyDelay + 'ms', style({
        'height': MINRADIOUS + 'px',
        'width': MINRADIOUS + 'px'
      })),
    ]
  },
};

@Directive({
  selector: '[touchTrail]'
})
export class TouchTrailDirective {
  dots: any[] = [];
  lastData: any;
  initialData: any;
  listenEnd: any;
  listenInit: any;
  listenMove: any;
  options: TouchTrailConf;
  disableTrail: boolean;
  @Input('disableTrail') set setDisableTrail(disabled: boolean) {
    this.disableTrail = disabled;
    if(this.disableTrail) {
      this.finishTrail();
    }
  }
  @Input('touchTrail') set setOptions(options: any) {
    this.options = Object.assign(DEFAULTOPTS, options);
  }
  @Output() touchTrailEnded = new EventEmitter();

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private ngZone: NgZone, private animationBuilder: AnimationBuilder) { }
  ngOnInit() {
    this.listenInit = this.renderer.listen(this.elementRef.nativeElement, 'touchstart', e => {
      this.initialData = this.getTouchData(e);
      if (this.options.clearOnInit) {
        this.clearDots(true);
      }
    });
    this.listenEnd = this.renderer.listen(this.elementRef.nativeElement, 'touchend', e => {
      if(!this.disableTrail) {
        this.finishTrail(e);
      }
    });
    this.listenMove = this.renderer.listen(this.elementRef.nativeElement, this.options.eventType === EventType.touch ? 'touchmove' : 'mousemove', e => {
      this.ngZone.runOutsideAngular(() => {
        if(!this.disableTrail) {
          const newPositionData = this.getTouchData(e);
          this.createDots(this.lastData && this.lastData.pos, newPositionData.pos);
          this.lastData = newPositionData;
        }
      });
    });
  }
  freezeDots() {
    this.dots.forEach((dot) => {
      dot.freeze();
    });
  }
  clearDots(force = false) {
    this.dots.forEach((dot) => {
      if ((force || !dot.isFreeze)) {
        dot.destroy();
      }
    });
    this.dots = this.dots.filter(d => d.el);
  }
  ngOnDestroy() {
    this.listenInit();
    this.listenEnd();
    this.listenMove();
  }
  private finishTrail(event?:any) {
    if (this.options.freezeOnEnd) {
      this.freezeDots();
    }
    if(this.initialData) {
      this.touchTrailEnded.emit({
        init: this.initialData,
        end: this.lastData
      });
    }
    this.lastData = null;
    this.initialData = null;
  }
  private iterpoolateDots(lastPosition, newPosition) {
    let dots = [];
    if (lastPosition) {
      const xP = newPosition[0] - lastPosition[0];
      const yP = newPosition[1] - lastPosition[1];
      const d = Math.sqrt(Math.pow(xP, 2) + Math.pow(yP, 2)) || 0.001;
      const xPd = xP / d;
      const yPd = yP / d;
      const maxSteps = Math.min(d / this.options.interpolationStep, this.options.maxInterpolatedDots);
      let step = 1;
      let getX = s => lastPosition[0] + xPd * (s * this.options.interpolationStep);
      let getY = s => lastPosition[1] + yPd * (s * this.options.interpolationStep);
      while (step < maxSteps) {
        dots.push([getX(step), getY(step)]);
        step++;
      }
    }
    return [...dots, newPosition]
  }
  private createDots(lastPosition, newPosition) {
    const interpolatedDots = this.iterpoolateDots(lastPosition, newPosition);
    for (const interpolatedDot of interpolatedDots) {
      this.createDot(interpolatedDot);
    };
  }
  private getTouchData(event) {
    return {
      pos: this.getPosition(event),
      timeStamp: event.timeStamp
    }
  }
  private getPosition(event) {
    let touch;
    if (event.clientX) {//mouse event
      touch = event;
    } else if (event.touches && event.touches.lenght) { //touchmove event
      touch = event.touches[0];
    } else {//touch start/end event
      touch = event.changedTouches[0];
    }
    return [touch.clientX, touch.clientY]
  }
  private clearFirstDotFromArray() {
    if (this.dots.length) {
      let firstDot = this.dots[0];
      if (!firstDot.isFreeze) {
        firstDot.destroy()
        this.dots.shift();
      }
    }
  }
  private animationMeta(i?): AnimationMetadata[] {
    return this.options.animationMeta(i, this.options);
  }
  private createDot(position) {
    const newDot = new TrailDot({
      animationFactory: this.animationBuilder.build(this.animationMeta(this.dots.length)),
      el: this.elementRef.nativeElement,
      pos: position,
      options: this.options,
      renderer: this.renderer
    });
    this.dots.push(newDot);
    this.checkMaxTrailElements();
    this.addDelayedDotDestroing();

  }
  private checkMaxTrailElements() {
    if (this.options.maxTrailElements && this.dots.length > this.options.maxTrailElements) {
      this.clearFirstDotFromArray();
    }
  }
  private addDelayedDotDestroing() {
    setTimeout(() => {
      this.clearFirstDotFromArray();
    }, this.options.destroyDelay);
  }
}
