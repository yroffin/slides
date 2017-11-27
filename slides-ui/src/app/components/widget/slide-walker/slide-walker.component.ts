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

import { FolderStoreService } from '../../../stores/folder-store.service';
import { SlideStoreService, SelectSlideAction } from '../../../stores/slide-store.service';
import { FolderBean } from '../../../models/common/folder-bean';

@Component({
  selector: 'app-slide-walker',
  templateUrl: './slide-walker.component.html',
  styleUrls: ['./slide-walker.component.css']
})
export class SlideWalkerComponent implements OnInit {

  public folderStream: Observable<FolderBean> = new Observable<FolderBean>();

  private items: TreeNode[] = [];
  private selectedSlides: TreeNode[];

  constructor(
    private folderStoreService: FolderStoreService,
    private slideStoreService: SlideStoreService
  ) {
    /**
     * find the folder store
     */
    this.folderStream = this.folderStoreService.select();

    this.items = [];
    this.folderStream.subscribe(
      (folder: FolderBean) => {
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
}
