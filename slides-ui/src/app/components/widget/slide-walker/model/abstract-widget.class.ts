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
import { ConnectorWidget } from './connector-widget.class';
import { SlideWalkerComponent } from '../slide-walker.component';

/**
 * interface widget
 */
export interface WidgetInterface {
  getGuid(): string
  getPrev(): string
  setPrev(guid: string)
  addOnTheRight(connector: ConnectorWidget)
  addOnTheLeft(connector: ConnectorWidget)
  addOnTheTop(connector: ConnectorWidget)
  addOnTheBottom(connector: ConnectorWidget)
  getElements(): any[]
  move(dx: number, dy: number)
  update()
}

/**
 * abstract WidgetAction
 */
export class WidgetAction {
  action: string;
  id: string;
}

/**
 * abstract WidgetBox
 */
export class WidgetBox {
  x: number;
  y: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

/**
 * abstract widget
 */
export class AbstractWidget implements WidgetInterface {

  protected snap: any;
  protected guid: string;
  protected label: string;
  
  private elements: any[] = new Array<any>();
  public static canDrag: boolean = true;

  protected isDebug: boolean = true;
  private debug: any;

  // start and end connector
  private onTheRights: ConnectorWidget[] = new Array<ConnectorWidget>();
  private onTheLefts: ConnectorWidget[] = new Array<ConnectorWidget>();
  private onTheTops: ConnectorWidget[] = new Array<ConnectorWidget>();
  private onTheBottoms: ConnectorWidget[] = new Array<ConnectorWidget>();

  private selector: Map<string, any> = new Map<string, any>();
  protected onDrag: () => void
  protected onClick: (widget: WidgetInterface, name: WidgetAction) => void

  // global group and set
  protected widget: any;
  protected anc: any;

  protected prev: string;
  protected next: string;

  /**
   * constructor
   * @param guid 
   * @param s 
   * @param label 
   * @param callback with action string (add, drop ...)
   */
  constructor(guid: string, s: any, label: string, callback: (widget: WidgetInterface, action: WidgetAction) => void) {
    this.guid = guid;
    this.label = label;
    this.snap = s;
    // on click callback
    this.onClick = callback;
  }

  public getPrev(): string {
    return this.prev;
  }

  public setPrev(guid: string) {
    this.prev = guid;
  }

  /**
   * get guid
   */
  public getGuid(): string {
    return this.guid;
  }

  /**
   * update this widget (may have move)
   */
  public update() {
    this.updateConnectors();
  }

  /**
   * fix label
   * @param label 
   */
  public setLabel(label: string) {
    this.label = label;
  }

  public before(widget: WidgetInterface) {
    _.each(this.elements, (local) => {
      _.each(widget.getElements(), (el) => {
        local.insertBefore(el);
      });
    });
  }

  public after(widget: WidgetInterface) {
    _.each(this.elements, (local) => {
      _.each(widget.getElements(), (el) => {
        el.after(local);
      });
    });
  }

  /**
   * register group element
   * @param element 
   */
  public register(element: any): void {
    this.elements.push(element);
  }

  /**
   * fix anchor
   * @param element 
   */
  public anchor(element: any): void {
    this.anc = Snap.set(element);
  }

  /**
   * add a new selector
   */
  protected addSelector(name: string, awesome: string): void {
    let group = this.snap.group().attr({
      style: "font-family: FontAwesome; font-size: 12; cursor: pointer",
      display: "none"
    });
    // click handler
    group.click((event) => {
      if (this.onClick) {
        this.onClick(this, { action: name, id: this.guid })
      }
    });
    this.selector.set(name, group);
    let circle = this.snap.circle(0, 0, 10).attr({
      fill: "red",
      stroke: "#000",
      strokeWidth: 3,
      display: ""
    });
    group.add(circle);
    let text = this.snap.text(0, 0, awesome).attr({
      fill: "white",
      display: ""
    });
    text.attr({
      x: -text.getBBox().w / 2,
      y: text.getBBox().h / 5,
    })
    group.add(text);
    // widget this selector
    this.widget.append(this.selector.get(name));
  }

  /**
   * init this widget
   */
  protected init(): any {
    this.widget = this.snap.group();
    this.anc = Snap.set();
    // Lets create big circle in the middle
    this.addSelector("add", '\uf0fe');
    this.addSelector("drop", '\uf1f8');
    this.addSelector("add-child", '\uf0e8');
    // drag callback
    let dragData: any;

    // drag handler
    this.widget.drag(
      // move
      (dx, dy) => {
        this.widget.attr({
          transform: dragData + (dragData ? "T" : "t") + [dx, dy]
        });
        this.updateConnectors()
        if (this.onDrag) {
          this.onDrag();
        }
      },
      // start
      () => {
        AbstractWidget.canDrag = false;
        dragData = this.widget.transform().local;
      },
      // end
      () => {
        AbstractWidget.canDrag = true;
        this.updateConnectors()
        if (this.onDrag) {
          this.onDrag();
        }
      });

    // update element view
    this.elements.push(this.widget);

    // hover callback when mouse is over the
    // main group
    this.widget.hover(
      () => {
        this.widget.attr({ filter: this.snap.filter(Snap.filter.shadow(2, 1, 1)) });
        let circle = 20;
        let selectors = this.selector.size;
        let index = 0;
        this.selector.forEach((value: any, key: string) => {
          this.moveTo(
            value,
            (this.anc.getBBox().width / 2) + Math.cos(Math.PI / selectors * index) * circle,
            (this.anc.getBBox().height / 2) + Math.sin(Math.PI / selectors * index) * circle
          );
          value.attr({
            display: ""
          });
          index++;
        });
      },
      () => {
        this.widget.attr({ filter: null });
        this.selector.forEach((value: any, key: string) => {
          value.attr({
            display: "none"
          });
        });
      })
    return this.widget;
  }

  /**
   * fix connector
   * @param connector 
   */
  public addOnTheRight(connector: ConnectorWidget) {
    this.onTheRights.push(connector);
    this.updateConnectors()
  }

  /**
   * fix connector
   * @param connector 
   */
  public addOnTheLeft(connector: ConnectorWidget) {
    this.onTheLefts.push(connector);
    this.updateConnectors()
  }

  /**
   * fix connector
   * @param connector 
   */
  public addOnTheTop(connector: ConnectorWidget) {
    this.onTheTops.push(connector);
    this.updateConnectors()
  }

  /**
   * fix connector
   * @param connector 
   */
  public addOnTheBottom(connector: ConnectorWidget) {
    this.onTheBottoms.push(connector);
    this.updateConnectors()
  }

  /**
   * display debug information
   */
  protected refreshDebug() {
    if(!this.isDebug) return;

    let debug = this.getBox().x + " x " + this.getBox().y + " * tx " + this.widget.transform();
    if (this.debug) this.debug.remove();
    this.debug = this.snap.text(10, 90, debug).attr({
      fontSize: 8
    });
    this.widget.add(this.debug);
  }

  /**
   * update connectors
   */
  private updateConnectors() {
    // draw each line to start connectors
    _.each(this.onTheRights, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getEW() === 'E') {
        connector.setStart(this.getBox().x + this.getBox().width, this.getBox().cy);
      } else {
        connector.setStart(this.getBox().x, this.getBox().cy);
      }
    })
    // draw each line to end connectors
    _.each(this.onTheLefts, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getEW() === 'W') {
        connector.setEnd(this.getBox().x + this.getBox().width, this.getBox().cy);
      } else {
        connector.setEnd(this.getBox().x, this.getBox().cy);
      }
    })
    // draw each line to start connectors
    _.each(this.onTheTops, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getNS() === 'S') {
        connector.setStart(this.getBox().cx, this.getBox().y + this.getBox().height);
      } else {
        connector.setStart(this.getBox().cx, this.getBox().y);
      }
    })
    // draw each line to end connectors
    _.each(this.onTheBottoms, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getNS() === 'S') {
        connector.setEnd(this.getBox().cx, this.getBox().y);
      } else {
        connector.setEnd(this.getBox().cx, this.getBox().y + this.getBox().height);
      }
    })
    // for debug draw text information about position
    this.refreshDebug();
  }

  /**
   * retrieve box area
   */
  public getBox(): WidgetBox {
    let raw = this.widget.getBBox();
    let box: WidgetBox = {
      x: raw.x,
      y: raw.y,
      cx: raw.cx,
      cy: raw.cy,
      width: raw.width,
      height: raw.height
    }
    return box
  }

  public getElements(): any[] {
    return this.elements;
  }

  /**
   * move element to
   * @param element 
   * @param dx 
   * @param dy 
   */
  public moveTo(element: any, dx: number, dy: number) {
    var local = element.transform().localMatrix.clone();
    local.b -= local.b;
    local.c -= local.c;
    local.e -= local.e;
    local.f -= local.f;
    element.transform(local.translate(dx, dy));
  }

  /**
   * move this widget
   * @param dx 
   * @param dy 
   */
  public move(dx: number, dy: number) {
    this.moveTo(this.widget, dx, dy);
    this.updateConnectors()
  }
}