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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State, Store } from '@ngrx/store';

import 'hammerjs/hammer';

import * as _ from 'lodash';

import 'snapsvg-cjs';

declare var Paper: any;
declare var Snap: any;
declare var mina: any;

import { TreeNode, OverlayPanel } from 'primeng/primeng';

import { DataSlidesService } from '../../../services/data-slides.service';
import { FolderBean, FolderElementBean } from '../../../models/common/folder-bean';
import { SlideBean } from '../../../models/common/slide-bean';
import { LoggerService } from '../../../services/logger.service';
import { ConnectorWidget } from './model/connector-widget.class';
import { SlideWidget } from './model/slide-widget.class';
import { SlideEntry } from './model/slide-entry.class';
import { SlidesStoreService } from '../../../stores/slides-store.service';
import { FoldersStoreService, LoadFoldersAction, AddFolderAction, DeleteFolderAction, InsertFolderAction, UpdateFolderAction, AppendChildFolderAction } from '../../../stores/folders-store.service';
import { StartWidget } from './model/start-widget.class';
import { WidgetInterface, AbstractWidget, WidgetAction } from './model/abstract-widget.class';
import { DataFoldersService } from '../../../services/data-folders.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-slide-walker',
  templateUrl: './slide-walker.component.html',
  styleUrls: ['./slide-walker.component.css']
})
export class SlideWalkerComponent implements OnInit, OnDestroy {

  /**
   * internal member for viewbox
   */
  private scrollx: number = 0;
  private scrolly: number = 0;
  private viewx: number = 0;
  private viewy: number = 0;
  private vieww: number = 800;
  private viewh: number = 600;
  private start: any;

  /**
   * internal streams and store
   */
  private slidesStream: Store<SlideBean[]>;
  private slides: SlideBean[]

  protected display: boolean = false;
  protected callback: (slide: SlideBean) => void;

  private subscriptions: Array<ISubscription> = new Array<ISubscription>();

  /**
   * internal streams and store
   */
  private folderStream: Store<FolderBean>;
  private folder: FolderBean

  private snap: any;
  private connectors: Array<ConnectorWidget> = new Array<ConnectorWidget>();
  private widgets: Map<string, WidgetInterface> = new Map<string, WidgetInterface>();

  /**
   * constructor
   * @param folderStoreService 
   * @param foldersStoreService 
   * @param slideStoreService 
   * @param slidesStoreService 
   * @param dataSlidesService 
   * @param logger 
   */
  constructor(
    private foldersStoreService: FoldersStoreService,
    private slidesStoreService: SlidesStoreService,
    private dataFoldersService: DataFoldersService,
    private dataSlidesService: DataSlidesService,
    private confirmationService: ConfirmationService,
    private logger: LoggerService
  ) {
    /**
     * subscribe
     */
    this.slidesStream = this.slidesStoreService.slides();

    this.subscriptions.push(this.slidesStream.subscribe(
      (elements: SlideBean[]) => {
        this.slides = elements;
      },
      error => {
        this.logger.error(error);
      },
      () => {
      }
    ));

    /**
     * subscribe
     */
    this.folderStream = this.foldersStoreService.folder();

    this.subscriptions.push(this.folderStream.subscribe(
      (element: FolderBean) => {
        this.folder = element;
        this.reload(this.folder);
      },
      error => {
        this.logger.error(error);
      },
      () => {
      }
    ));
  }

  /**
   * ngInit handler
   */
  ngOnInit() {
    this.snap = Snap("#svg").attr({
      viewBox: "0 0 800 600",
      style: 'stroke-width: 5px; background-color: grey;'
    });

    // fix desk drag and move handler
    this.dragAndMove();
  }

  /**
   * ngDestroy
   */
  ngOnDestroy() {
    _.each(this.subscriptions, (sub: ISubscription) => {
      sub.unsubscribe();
    });
  }

  /**
   * update viewport
   */
  private updateViewPort(scrollx: number, scrolly: number) {
    this.scrollx = scrollx;
    this.scrolly = scrolly;
    this.viewx = this.scrollx;
    this.viewy = this.scrolly;
    let viewport = this.viewx + " " + this.viewy + " " + this.vieww + " " + this.viewh;
    this.snap.attr({
      viewBox: viewport
    });
  }

  /**
   * scrollbar
   */
  private scrollXChange(event) {
    this.updateViewPort(event.value, this.scrolly);
  }

  /**
   * scrollbar
   */
  private scrollYChange(event) {
    this.updateViewPort(this.scrolly, event.value);
  }

  /**
   * desktop drag handler
   */
  private dragAndMove() {
    let dragData;
    /**
     * mousedown handler
     */
    this.snap.mousedown((event) => {
      dragData = {
        dx: event.clientX,
        dy: event.clientY,
        scrollx: this.scrollx,
        scrolly: this.scrolly
      }
    });

    /**
     * mousemove handler
     */
    this.snap.mousemove((event) => {
      if (dragData) {
        let dx = event.clientX - dragData.dx;
        let dy = event.clientY - dragData.dy;
        if (AbstractWidget.canDrag) {
          this.updateViewPort(dragData.scrollx + dx, dragData.scrolly + dy);
        }
      }
    });

    /**
     * mouseup handler
     */
    this.snap.mouseup((event) => {
      if (dragData) {
        let dx = event.clientX - dragData.dx;
        let dy = event.clientY - dragData.dy;
        dragData = null;
      }
    });
  }

  /**
   * compute newGuid
   */
  protected newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * connect
   * @param from 
   * @param to 
   */
  private connectLeftRight(from: WidgetInterface, to: WidgetInterface) {
    // create a new connector
    let connector = new ConnectorWidget(this.newGuid(), this.snap, "", (widget: WidgetInterface) => {
    });
    this.connectors.push(connector);
    from.addOnTheRight(connector);
    to.addOnTheLeft(connector);
    connector.after(from);
    connector.after(to);
  }

  /**
   * connect
   * @param from 
   * @param to 
   */
  private connectTopBottom(from: WidgetInterface, to: WidgetInterface) {
    // create a new connector
    let connector = new ConnectorWidget(this.newGuid(), this.snap, "", (widget: WidgetInterface) => {
    });
    this.connectors.push(connector);
    from.addOnTheTop(connector);
    to.addOnTheBottom(connector);
    connector.after(from);
    connector.after(to);
  }

  /**
   * reload world
   * @param folder 
   */
  private reload(folder: FolderBean) {
    if (!this.snap) return;

    this.snap.clear();
    this.widgets.clear();
    this.connectors = new Array<ConnectorWidget>();

    // declare start
    this.start = new StartWidget(this.newGuid(), this.snap, "start", (widget: WidgetInterface, link: WidgetAction) => {
      if (link.action === "add") {
        this.selectSlide((slide: SlideBean) => {
          let folderElement: FolderElementBean = {
            id: this.newGuid(),
            reference: slide.id,
            children: new Array<FolderElementBean>()
          };
          this.foldersStoreService.dispatch(new InsertFolderAction({ folder: this.folder, folderElement: folderElement }));
        });
      }
    });
    this.start.move(25, 25);

    this.widgets.set(this.start.getGuid(), this.start);

    // build all widget based on folders
    this.reloadChild(this.start, folder.children);

    // build all connectors
    this.reloadConnectors(this.start, folder.children, true);

    // dispose all widgets
    this.dispose(0, 20, 50, this.start, folder.children, true);
  }

  /**
   * dispose widgets
   * @param start 
   * @param folderElements 
   */
  private dispose(level: number, x: number, y: number, start: WidgetInterface, folderElements: FolderElementBean[], order: boolean) {
    if (level === 0) {
      start.move(x, y);
      x += 100;
    }
    _.each(folderElements, (folderElement: FolderElementBean) => {
      let widget: WidgetInterface = this.widgets.get(folderElement.id);
      widget.move(x, y);
      // scan children
      if (folderElement.children) {
        this.dispose(level + 1, x, y + 150, widget, folderElement.children, false);
      }
      if(order) x += 200;
      else y += 150;
    });
    // update start
    start.update();
    // update all connectors
    _.each(folderElements, (folderElement: FolderElementBean) => {
      let widget: WidgetInterface = this.widgets.get(folderElement.id);
      widget.update();
    });
  }

  /**
   * load connectors
   * @param start 
   * @param folderElements 
   */
  private reloadConnectors(start: WidgetInterface, folderElements: FolderElementBean[], order: boolean) {
    let last = null;
    _.each(folderElements, (folderElement: FolderElementBean) => {
      let widget: WidgetInterface = this.widgets.get(folderElement.id);
      if (last === null) {
        if(order) {
          this.connectLeftRight(start, widget);
        } else {
          this.connectTopBottom(start, widget);
        }
      } else {
        if(order) {
          this.connectLeftRight(last, widget);
        } else {
          this.connectTopBottom(last, widget);
        }
      }
      last = widget;
      // scan children
      if (folderElement.children) {
        this.reloadConnectors(widget, folderElement.children, false);
      }
    });
  }

  /**
   * reload all child
   * @param start 
   * @param folderElements 
   */
  private reloadChild(start: AbstractWidget, folderElements: FolderElementBean[]) {
    let previous = start;
    _.each(folderElements, (folderElement: FolderElementBean) => {
      // map folder element id, and create new one if empty
      if (!folderElement.id || folderElement.id === "") {
        folderElement.id = this.newGuid();
      }
      let widget = new SlideWidget(folderElement.id, folderElement.reference, this.snap, folderElement.reference, (widget: WidgetInterface, link: WidgetAction) => {
        if (link.action === "add") {
          this.selectSlide((slide: SlideBean) => {
            let folderElement: FolderElementBean = {
              id: this.newGuid(),
              reference: slide.id,
              children: new Array<FolderElementBean>()
            };
            this.foldersStoreService.dispatch(new InsertFolderAction({ folder: this.folder, folderElement: folderElement }));
          });
        }
        if (link.action === "add-child") {
          this.selectSlide((slide: SlideBean) => {
            let folderElement: FolderElementBean = {
              id: this.newGuid(),
              reference: slide.id,
              children: new Array<FolderElementBean>()
            };
            this.foldersStoreService.dispatch(new AppendChildFolderAction({ id: link.id, folder: this.folder, folderElement: folderElement }));
          });
        }
      });
      widget.setPrev(previous.getGuid());
      previous = widget;
      this.widgets.set(widget.getGuid(), widget);
      this.reloadChild(widget, folderElement.children);
    });
  }

  /**
   * select one slide
   */
  protected selectSlide(callback: (slide: SlideBean) => void) {
    this.display = true;
    this.callback = callback;
  }

  /**
   * select a new slide
   * @param event 
   */
  protected onSlideChangeHandler(slide: SlideBean) {
    this.callback(slide);
    this.display = false;
  }

  /**
   * confirm drop
   * @param folder 
   */
  confirmOnDrop(folder: FolderBean) {
    this.confirmationService.confirm({
      message: 'Drop folder ' + folder.name,
      accept: () => {
        this.onDrop(folder);
      }
    });
  }

  /**
   * selection handler
   * @param data 
   */
  protected onSave(folder: FolderBean) {
    let updated
    this.dataFoldersService.Update(folder.id, folder)
      .subscribe(
      (data: FolderBean) => updated = data,
      error => this.logger.error("While updating", folder, error),
      () => {
        this.foldersStoreService.dispatch(new UpdateFolderAction(
          folder
        ));
      });
  }

  /**
   * view folder
   * @param folder 
   */
  protected onView(folder: FolderBean) {
    window.open("/api/presentation/" + folder.id, "_blank");
  }

  /**
   * view folder
   * @param folder 
   */
  protected onDispose(start: any, folder: FolderBean) {
    // dispose all widgets
    this.dispose(0, 20, 50, start, folder.children, true);
  }

  /**
  * delete folder
  * @param folder a folder to delete 
  */
  protected onDrop(folder: FolderBean) {
    let deleted
    this.dataFoldersService.Delete(folder.id)
      .subscribe(
      (data: FolderBean) => deleted = data,
      error => this.logger.error("While deleting", folder, error),
      () => {
        this.foldersStoreService.dispatch(new DeleteFolderAction(
          folder
        ));
      });
  }
}
