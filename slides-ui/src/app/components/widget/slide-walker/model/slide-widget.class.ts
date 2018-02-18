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
import { SlideBean } from '../../../../models/common/slide-bean';
import { DataSlidesService } from '../../../../services/data-slides.service';

export class SlideWidget extends AbstractWidget {

  private target: string;
  private rect: any;
  private text: any;
  private name: any;

  private slide: SlideBean;

  /**
   * constructor
   * @param guid 
   * @param target 
   * @param s 
   * @param label 
   * @param callback 
   */
  constructor(guid: string, target: string, s: any, label: string, dataSlidesService: DataSlidesService, callback: (widget: WidgetInterface, action: WidgetAction) => void) {
    super(guid, s, label, callback);
    this.target = target;
    dataSlidesService.GetSingle(target).subscribe(
      (data: SlideBean) => {
        this.slide = Object.assign({}, data);
        this.name.attr({text: "name: " + this.slide.name});
      },
      (error) => {
        console.error(error);
      }
    )
    this.init();
    // on click callback
    this.onClick = callback;

    this.isDebug = false;
  }

  /**
   * fix label
   * @param label 
   */
  public setLabel(label: string) {
    super.setLabel(label);
    this.text = this.snap.text(50, 50, this.label);
  }

  /**
   * init this widget
   */
  protected init() {
    super.init();

    this.addSelector("update-reference", '\uf044');

    // rect area
    this.rect = this.snap.rect(0, 0, 100, 100).attr({
      fill: "#bada55",
      stroke: "#000",
      strokeWidth: 5
    });

    // text area
    this.text = this.snap.text(10, 10, "id: " + this.guid).attr({
      fontSize: 8
    });
    let alt = this.snap.text(10, 20, "reference: " + this.label).attr({
      fontSize: 8
    });
    this.name = this.snap.text(10, 30, "name: " + "").attr({
      fontSize: 8
    });

    this.widget.prepend(this.rect)
    this.widget.append(this.text);
    this.widget.append(alt);
    this.widget.append(this.name);
    this.anchor(this.rect);
    return this.widget;
  }

  /**
   * retrieve box area
   */
  public getBox(): WidgetBox {
    let box: WidgetBox = super.getBox();
    box.width = eval(this.rect.attr("width"));
    box.height = eval(this.rect.attr("height"));
    box.cx = box.x + box.width / 2;
    box.cy = box.y + box.height / 2;
    return box;
  }
}