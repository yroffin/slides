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

import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import * as _ from 'lodash';

import { HomeComponent } from './components/common/home/home.component';

import { MenuItem } from 'primeng/primeng';
import { DataSlidesService } from './services/data-slides.service';
import { LoggerService } from './services/logger.service';
import { SlideBean } from './models/common/slide-bean';
import { SlidesStoreService, LoadSlidesAction, AddSlidesAction, DeleteSlidesAction, SelectSlideAction } from './stores/slides-store.service';
import { Store } from '@ngrx/store/src/store';
import { FolderBean } from './models/common/folder-bean';
import { FoldersStoreService, LoadFoldersAction, SelectFolderAction } from './stores/folders-store.service';
import { DataFoldersService } from './services/data-folders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: MenuItem[];
  tools: MenuItem[];

  right: boolean = false
  left: boolean = false

  // folders
  foldersStream: Store<FolderBean[]>;
  folders: FolderBean[]
  folderStream: Store<FolderBean>;
  folder: FolderBean

  // slides
  slidesStream: Store<SlideBean[]>;
  slides: SlideBean[]
  slideStream: Store<SlideBean>;
  slide: SlideBean

  /**
   * constructor
   * @param dataSlidesService 
   * @param foldersStoreService 
   * @param folderStoreService 
   * @param slideStoreService 
   * @param slidesStoreService 
   * @param logger 
   */
  constructor(
    private dataSlidesService: DataSlidesService,
    private dataFoldersService: DataFoldersService,
    private foldersStoreService: FoldersStoreService,
    private slidesStoreService: SlidesStoreService,
    private logger: LoggerService
  ) {
    /**
     * subscribe for all folders store
     */
    this.foldersStream = this.foldersStoreService.folders();

    this.foldersStream.subscribe(
      (element: FolderBean[]) => {
        this.folders = element;
      },
      error => {
        console.error(error);
      },
      () => {
      }
    );

    /**
     * subscribe for current folder
     */
    this.folderStream = this.foldersStoreService.folder();

    this.folderStream.subscribe(
      (element: FolderBean) => {
        this.folder = element;
      },
      error => {
        console.error(error);
      },
      () => {
      }
    );

    /**
     * subscribe for all slides store
     */
    this.slidesStream = this.slidesStoreService.slides();

    this.slidesStream.subscribe(
      (element: SlideBean[]) => {
        this.slides = element;
      },
      error => {
        console.error(error);
      },
      () => {
      }
    );

    /**
     * subscribe for current slide
     */
    this.slideStream = this.slidesStoreService.slide();

    this.slideStream.subscribe(
      (element: SlideBean) => {
        this.slide = element;
      },
      error => {
        console.error(error);
      },
      () => {
      }
    );
  }

  ngOnInit() {
    // load the menu
    this.loadMenu();
    // load all slides
    this.loadSlides();
    // load all folders
    this.loadFolders();
  }

  /**
   * select a new slide
   * @param event 
   */
  protected onSlideChangeHandler(event: any) {
    this.slidesStoreService.dispatch(new SelectSlideAction(
      event.data
    ));
    this.right = false;
  }

  /**
   * select a new folder
   * @param event 
   */
  protected onFolderChangeHandler(event: any) {
    this.foldersStoreService.dispatch(new SelectFolderAction(
      event.data
    ));
    this.right = false;
  }

  /**
   * open in a new window the current presentation
   * @param data 
   */
  protected onOpenDocument() {
    window.open("/api/presentation", "_blank");
  }

  /**
   * load all slides
   */
  private loadSlides() {
    let slides
    this.dataSlidesService.GetAll()
      .subscribe(
      (data: SlideBean[]) => slides = data,
      error => this.logger.error("While loading resources", error),
      () => {
        this.slidesStoreService.dispatch(new LoadSlidesAction(
          slides
        ));
        this.slidesStoreService.dispatch(new SelectSlideAction(
          slides[0]
        ));
      });
  }

  /**
   * load all folders
   */
  private loadFolders() {
    let folders
    this.dataFoldersService.GetAll()
      .subscribe(
      (data: FolderBean[]) => folders = data,
      error => this.logger.error("While loading resources", error),
      () => {
        this.foldersStoreService.dispatch(new LoadFoldersAction(
          folders
        ));
      });
  }

  /**
   * load system menu
   */
  private loadMenu(): void {
    this.tools = [
      {
        label: 'Pick', icon: 'fa-tags', command: (event) => {
          this.right = true;
        }
      },
      { label: 'Folders', icon: 'fa-sitemap', routerLink: ['/folders'] },
      { label: 'Slide', icon: 'fa-sticky-note-o', routerLink: ['/slide'] }
    ];
    this.items = [
      { label: 'Browse', icon: 'fa-tasks', routerLink: ['/folders'] },
      { label: 'Browse', icon: 'fa-eye', routerLink: ['/slide'] },
      {
        label: 'Calendar', icon: 'fa-calendar', command: (event) => {
          this.right = true;
        }
      },
      {
        label: 'File',
        items: [
          { label: 'New', icon: 'fa-plus' },
          { label: 'Open', icon: 'fa-download' },
          { label: 'Save', icon: 'fa-save' }
        ]
      },
      { label: 'Browse', icon: 'fa-flask', routerLink: ['/browser'] },
      {
        label: 'Calendar', icon: 'fa-calendar', command: (event) => {
          window.open("/api/presentation", "_blank");
        }
      },
      { label: 'Documentation', icon: 'fa-book' },
      { label: 'Support', icon: 'fa-support' },
      { label: 'Social', icon: 'fa-twitter' }
    ];
  }
}
