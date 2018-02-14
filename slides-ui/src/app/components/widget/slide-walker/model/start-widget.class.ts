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
import { AbstractWidget, WidgetInterface, WidgetAction, WidgetBox } from './abstract-widget.class';

export class StartWidget extends AbstractWidget {

  private circle_1: any;
  private circle_2: any;

  constructor(guid: string, s: any, label: string, callback: (widget: WidgetInterface, action: WidgetAction) => void) {
    super(guid, s, label, callback);
    this.init();
    // on click callback
    this.onClick = callback;
  }

  /**
   * init this widget
   */
  protected init() {
    super.init();
    
    // circle
    this.circle_1 = this.snap.circle(15, 15, 15).attr({
      fill: "#00ff00",
      strokeWidth: 1.5,
      stroke: "#000",
      strokeDasharray: 2
    });

    this.circle_2 = this.snap.circle(15, 15, 25).attr({
      fill: "#B8D078",
      strokeWidth: 2,
      stroke: "#000"
    });

    this.widget.prepend(this.circle_1)
    this.widget.prepend(this.circle_2)
    this.anchor(this.circle_1);
    return this.widget;
  }

  /**
   * retrieve box area
   */
  public getBox(): WidgetBox {
    let box: WidgetBox = super.getBox();
    box.width = 50;
    box.height = 50;
    box.cx = box.x + box.width / 2;
    box.cy = box.y + box.height / 2;
    return box;
  }
}