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

import * as _ from 'lodash';

import { TreeNode } from 'primeng/primeng';

import { DataSlidesService } from '../../../services/data-slides.service';
import { FolderStoreService } from '../../../stores/folder-store.service';
import { SlideStoreService, SelectSlideAction } from '../../../stores/slide-store.service';
import { FolderBean } from '../../../models/common/folder-bean';
import { SlideBean } from '../../../models/common/slide-bean';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-slide-walker',
  templateUrl: './slide-walker.component.html',
  styleUrls: ['./slide-walker.component.css']
})
export class SlideWalkerComponent implements OnInit {

  public folderStream: Observable<FolderBean> = new Observable<FolderBean>();

  private items: TreeNode[] = [];
  private selectedSlides: TreeNode[];
  private selectedFolder: FolderBean;

  constructor(
    private folderStoreService: FolderStoreService,
    private slideStoreService: SlideStoreService,
    private dataSlidesService: DataSlidesService,
    private logger: LoggerService
  ) {
    /**
     * find the folder store
     */
    this.folderStream = this.folderStoreService.select();

    let all: SlideBean[]
    dataSlidesService.GetAll()
      .subscribe(
      (data: SlideBean[]) => all = data,
      error => this.logger.error("In loadResource", error),
      () => {
        let allSlides = {
          elements: []
        };
        let that = this;
        /**
         * order by name then chunk it by piece of max
         */
        _.forEach(_.orderBy(all, ['name'], ['asc']), function (chunked) {
          allSlides.elements.push({
            id: chunked.id,
            name: chunked.name
          });
        });
      });

    this.items = [];
    this.folderStream.subscribe(
      (folder: FolderBean) => {
        this.selectedFolder = folder;
        let item: TreeNode = {
          data: {
            id: folder.id,
            name: folder.name,
            type: "folder",
          },
          children: []
        };
        this.items.push(item);
        /**
         * iterate on items
         */
        _.each(folder.slides, (slide) => {
          let element = {
            data: {
              id: slide.id,
              name: slide.title,
              type: "slide",
              slide: slide
            },
            children: []
          };
          item.children.push(element);

          _.each(slide.slides, (slide) => {
            let subelement = {
              data: {
                id: slide.id,
                name: slide.title,
                type: "slide",
                slide: slide
              },
              children: []
            };
            element.children.push(subelement);
          });
        });
      },
      error => {
        console.error(error);
      },
      () => {
      }
    );
  }

  ngOnInit() {
  }

  /**
   * 
   * @param event select this slide
   */
  public selectSlide(event): void {
    if (event.node.data.slide) {
      this.slideStoreService.dispatch(new SelectSlideAction(
        event.node.data.slide
      ));
    }
  }

  /**
   * open folder in view mode
   */
  public viewFolder(): void {
    window.open("http://jarvis.acme.com:4200/api/reveal/folder/1", "_blank");
    // window.open("/api/folder/"+this.selectedFolder.id, "_blank");
  }
}
