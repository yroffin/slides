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
  addStart(connector: ConnectorWidget)
  addEnd(connector: ConnectorWidget)
  getElements(): any[]
  move(dx: number, dy: number)
  update()
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

  private debug: any;

  // start and end connector
  private starts: ConnectorWidget[] = new Array<ConnectorWidget>();
  private ends: ConnectorWidget[] = new Array<ConnectorWidget>();

  private selector: Map<string, any> = new Map<string, any>();
  protected onDrag: () => void
  protected onClick: (widget: WidgetInterface, name: string) => void

  // global group and set
  protected group: any;
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
  constructor(guid: string, s: any, label: string, callback: (widget: WidgetInterface, action: string) => void) {
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
  protected addSelector(name: string): void {
    this.selector.set(name, this.snap.circle(0, 0, 10).attr({
      fill: "red",
      stroke: "#000",
      strokeWidth: 3,
      display: "none"
    }));
    this.group.append(this.selector.get(name));
  }

  /**
   * init this widget
   */
  protected init(): any {
    this.group = this.snap.group();
    this.anc = Snap.set();
    // Lets create big circle in the middle
    this.addSelector("add");
    this.addSelector("drop");
    this.addSelector("add-child");
    // drag callback
    let dragData: any;

    // drag handler
    this.group.drag(
      // move
      (dx, dy) => {
        this.group.attr({
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
        dragData = this.group.transform().local;
      },
      // end
      () => {
        AbstractWidget.canDrag = true;
        this.updateConnectors()
        if (this.onDrag) {
          this.onDrag();
        }
      });

    // click callback
    this.selector.forEach((value: any, key: string) => {
      value.click((event) => {
        if (this.onClick) {
          this.onClick(this, key)
        }
      });
    });

    this.elements.push(this.group);

    // hover callback when mouse is over the
    // main group
    this.group.hover(
      () => {
        this.group.attr({ filter: this.snap.filter(Snap.filter.shadow(2, 1, 1)) });
        let circle = 20;
        let selectors = this.selector.size;
        let index = 0;
        this.selector.forEach((value: any, key: string) => {
          value.attr({
            cx: (this.anc.getBBox().width / 2) + Math.cos(Math.PI / selectors * index) * circle,
            cy: (this.anc.getBBox().height / 2) + Math.sin(Math.PI / selectors * index) * circle,
            display: ""
          });
          index ++;
        });
      },
      () => {
        this.group.attr({ filter: null });
        this.selector.forEach((value: any, key: string) => {
          value.attr({
            display: "none"
          });
        });
      })
    return this.group;
  }

  /**
   * fix start connector
   * @param connector 
   */
  public addStart(connector: ConnectorWidget) {
    this.starts.push(connector);
    this.updateConnectors()
  }

  /**
   * fix end connector
   * @param connector 
   */
  public addEnd(connector: ConnectorWidget) {
    this.ends.push(connector);
    this.updateConnectors()
  }

  /**
   * display debug information
   */
  protected refreshDebug() {
    let debug = this.group.getBBox().x + " x " + this.group.getBBox().y + "\n tx " + this.group.transform();
    if (this.debug) this.debug.remove();
    this.debug = this.snap.text(10, 90, debug).attr({
      fontSize: 8
    });
    this.group.add(this.debug);
  }

  /**
   * update connectors
   */
  private updateConnectors() {
    // draw each line to start connectors
    _.each(this.starts, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getLabel() === 'NE' || direction.getLabel() === 'SE') {
        connector.setStart(this.group.getBBox().x + this.group.getBBox().width, this.group.getBBox().cy);
      } else {
        connector.setStart(this.group.getBBox().x, this.group.getBBox().cy);
      }
    })
    // draw each line to end connectors
    _.each(this.ends, (connector: ConnectorWidget) => {
      let direction = connector.direction();
      if (direction.getLabel() === 'NE' || direction.getLabel() === 'SE') {
        connector.setEnd(this.group.getBBox().x, this.group.getBBox().cy);
      } else {
        connector.setEnd(this.group.getBBox().x + this.group.getBBox().width, this.group.getBBox().cy);
      }
    })
    // for debug draw text information about position
    this.refreshDebug();
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
    this.moveTo(this.group, dx, dy);
    this.updateConnectors()
  }
}