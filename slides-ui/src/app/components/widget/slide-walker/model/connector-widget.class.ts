/* 
 * Copyright 2017 Yannick Roffin.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'snapsvg-cjs';
declare var Snap: any;
declare var mina: any;

import * as _ from 'lodash';
import { AbstractWidget, WidgetInterface } from './abstract-widget.class';

/**
 * to compute direction
 */
export class Direction {
  public NS: string;
  public EW: string;
  public getLabel(): string {
    return this.NS+this.EW;
  }
  public getNS(): string {
    return this.NS;
  }
  public getEW(): string {
    return this.EW;
  }
}

/**
 * simple widget connector with a line and 2 edges
 */
export class ConnectorWidget extends AbstractWidget {

  private line: any;
  private start: any;
  private end: any;
  private startDebug: any;
  private endDebug: any;

  constructor(guid: string, s: any, label: string, callback: (widget: WidgetInterface) => void) {
    super(guid, s, label, callback);

    this.line = this.snap.line(0, 0, 100, 100).attr({
      fill: "#bada55",
      stroke: "#000",
      strokeWidth: 5,
      strokeDasharray: 5
    });
    this.register(this.line);

    let circle;

    circle = this.snap.circle(0, 0, 8).attr({
      fill: "blue",
      stroke: "#000",
      strokeWidth: 3
    });
    this.start = this.snap.group(circle);
    this.register(this.start);

    circle = this.snap.circle(0, 0, 8).attr({
      fill: "red",
      stroke: "#000",
      strokeWidth: 3
    });
    this.end = this.snap.group(circle);
    this.register(this.end);
  }

  /**
   * refresh debug information
   */
  protected refreshDebug() {
    // start
    if (this.startDebug) this.startDebug.remove();
    this.startDebug = this.snap.text(10, -20, this.direction().getLabel()).attr({
      fontSize: 8
    });
    this.start.add(this.startDebug);
    // end
    if (this.endDebug) this.endDebug.remove();
    this.endDebug = this.snap.text(10, 20, this.direction().getLabel()).attr({
      fontSize: 8
    });
    this.end.add(this.endDebug);
  }

  /**
   * compute direction
   * - North, East, South, West
   */
  public direction(): Direction {
    let direction = new Direction()
    let start = this.start.getBBox();
    let end = this.end.getBBox();
    if(start.cx < end.cx) {
      direction.EW = 'E';
    } else {
      direction.EW = 'W';
    }
    if(start.cy > end.cy) {
      direction.NS = 'N';
    } else {
      direction.NS = 'S';
    }
    return direction;
  }

  /**
   * draw line to this start connector
   * @param x 
   * @param y 
   */
  public setStart(x: number, y: number) {
    this.line.attr({ x1: x, y1: y })
    this.moveTo(this.start, x, y);
    this.refreshDebug();
  }

  /**
   * draw line to this end connector
   * @param x 
   * @param y 
   */
  public setEnd(x: number, y: number) {
    this.line.attr({ x2: x, y2: y })
    this.moveTo(this.end, x, y);
    this.refreshDebug();
  }
}