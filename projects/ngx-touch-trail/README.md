# NgxTouchTrail

## Features
- Create a trail that follows finger on touch move (or mouse on mousemove)
- You can set your own animation to trail elements
- the trail process works on runOutsideAngular, avoiding change detection calls.
- On finish launch a event touchTrailEnded with information about initial and final position

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.9.

## Demo

![Example gif](https://raw.githubusercontent.com/jbarog/ngx-touch-trail/master/src/assets/demo.gif?raw=true)

[Demo here](https://----.github.io).

## Installation

```bash
npm i ngx-touch-trail --save
```
`@angular/animations` package is a required dependency for the default toast

```bash
npm install @angular/animations --save
```

## Setup
### Module:
```typescript
import { NgxTouchTrailModule } from 'ngx-touch-trail'
....
imports: [
  .....
  NgxTouchTrailModule
],
```
### Component
It works as a directive so
```html
<div touchTrail (touchTrailEnded)="consoleLog($event)">
  <span>touch and move</span>
</div>
```
or customize it:
```html
<div
  touchTrail="{color:'#f00',eventType:'mouse'}"
  [disableTrail]="isTrailActive"
  (touchTrailEnded)="consoleLog($event)">
  <span>touch and move</span>
</div>
```
## Parameters

Name  | Description | Default |
------------- | ------------- | -------------
(touchTrailEnded)  | Called when trail finish (usually on touchend)|
className  | Set dot class   | 'touch-trail-dot'
eventType  | Set trigger event (touch/mouse) | 'touch'
destroyDelay  | ms before dot get destroyed | 400
interpolationStep  | Pixels between interpolated dots | 100
maxInterpolatedDots  | Max number of interpolated dots | 90
color  | Trail color | '#3da4ab'
clearOnInit  | At begining of new trail destroy previous one (usually on touchstrat) | true
freezeOnEnd  | Freeze dots on trail finish (usually on touchend) | false
animationMeta  | Animation method  | (index: number, options: any) => AnimationMetadata[]

## animationMeta

This method controls dots animation it get

Name  | Description |
------------- | -------------
index  | Index in dots array
options  | Full options object  
