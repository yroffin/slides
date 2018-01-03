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

import { HomeComponent } from './components/common/home/home.component';
import { FolderStoreService, SelectFolderAction } from './stores/folder-store.service';

import { MenuItem } from 'primeng/primeng';
import { DataSlidesService } from './services/data-slides.service';
import { LoggerService } from './services/logger.service';
import { SlideBean } from './models/common/slide-bean';
import { SlidesStoreService, LoadSlidesAction } from './stores/sides-store.service';
import { Store } from '@ngrx/store/src/store';
import { SlideStoreService, SelectSlideAction } from './stores/slide-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: MenuItem[];
  display: boolean = false

  slidesStream: Store<SlideBean[]>;
  slides: SlideBean[]

  constructor(
    private folderStoreService: FolderStoreService,
    private dataSlidesService: DataSlidesService,
    private slideStoreService: SlideStoreService,
    private slidesStoreService: SlidesStoreService,
    private logger: LoggerService
  ) {
    /**
     * find the folder store
     */
    this.slidesStream = this.slidesStoreService.select();

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
  }

  ngOnInit() {
    this.loadMenu();
    this.loadSlides();
  }

  /**
   * selection handler
   * @param data 
   */
  protected onSelectionChangeHandler(data: any) {
    this.slideStoreService.dispatch(new SelectSlideAction(
      data.value[0]
    ));
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
      });
  }

  /**
   * load system menu
   */
  private loadMenu(): void {
    this.items = [
      {
        label: 'Calendar', icon: 'fa-calendar', command: (event) => {
          this.display = true;
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
