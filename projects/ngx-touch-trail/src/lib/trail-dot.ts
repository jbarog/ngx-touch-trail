import { AnimationPlayer } from '@angular/animations';
export class TrailDot {
  el: HTMLDivElement;
  animationPlayer: AnimationPlayer | null;
  animationFactory: any;
  parent: HTMLDivElement;
  renderer: any;
  isFreeze: boolean = false;
  constructor(params) {
    this.parent = params.el;
    this.renderer = params.renderer;
    this.animationFactory = params.animationFactory;
    this.setDot(params.pos, params.options.className);
    this.setAnimation();
  }
  freeze(undo = false) {
    this.isFreeze = !undo;
    this.animationPlayer[undo ? 'play' : 'pause']();
  }
  destroy() {
    if (this.el) {
      this.renderer.removeChild(this.parent, this.el);
      this.el = null;
      this.animationPlayer.pause();
      this.animationPlayer.destroy();
      this.animationPlayer = null;
    }
  }
  private setDot(position, className) {
    this.el = this.renderer.createElement('div');
    this.renderer.addClass(this.el, className);
    this.renderer.setStyle(this.el, 'left', position[0] + 'px');
    this.renderer.setStyle(this.el, 'top', position[1] + 'px');
    this.renderer.appendChild(this.parent, this.el);
  }
  private setAnimation() {
    this.animationPlayer = this.animationFactory.create(this.el);
    this.animationPlayer.play();
  }
}
