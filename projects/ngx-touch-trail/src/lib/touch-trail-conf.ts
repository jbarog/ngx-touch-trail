import { AnimationMetadata } from '@angular/animations';
export interface TouchTrailConf {
  className: string,
  destroyDelay: number,
  interpolationStep: number,
  maxInterpolatedDots: number,
  maxTrailElements: number,
  eventType: string,
  color: string,
  clearOnInit: boolean,
  freezeOnEnd: boolean,
  animationMeta?: (index: number, options: any) => AnimationMetadata[],
}
export type EventType = 'mouse' | 'touch';
export const EventType = {
  mouse: 'mouse' as EventType,
  touch: 'touch' as EventType
};
