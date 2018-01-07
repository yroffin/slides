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
import { FolderStoreService, SelectFolderAction } from './stores/folder-store.service';

import { MenuItem } from 'primeng/primeng';
import { DataSlidesService } from './services/data-slides.service';
import { LoggerService } from './services/logger.service';
import { SlideBean } from './models/common/slide-bean';
import { SlidesStoreService, LoadSlidesAction, AddSlidesAction, DeleteSlidesAction } from './stores/sides-store.service';
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
  slideStream: Store<SlideBean>;
  slide: SlideBean

  constructor(
    private folderStoreService: FolderStoreService,
    private dataSlidesService: DataSlidesService,
    private slideStoreService: SlideStoreService,
    private slidesStoreService: SlidesStoreService,
    private logger: LoggerService
  ) {
    /**
     * subscribe for all slides store
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

    /**
     * subscribe for current slide
     */
    this.slideStream = this.slideStoreService.select();

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
  }

  /**
   * select a new slide
   * @param data 
   */
  protected onSelectionChangeHandler(event: any) {
    this.slideStoreService.dispatch(new SelectSlideAction(
      event.data
    ));
    this.display = false;
  }

  /**
   * add a new slide
   * @param data 
   */
  protected onCreate(event: any) {
    let slide: SlideBean = new SlideBean();
    slide.name = "Nouveau slide";
    slide.body = "Todo ...";
    this.dataSlidesService.Add(slide).subscribe(
      (data) => {
        this.slidesStoreService.dispatch(new AddSlidesAction(
          data
        ));
        this.slideStoreService.dispatch(new SelectSlideAction(
          data
        ));
      }
    );
  }

  /**
   * duplicate current
   * @param data 
   */
  protected onDuplicate(event: any) {
    let slide: SlideBean = Object.assign(new SlideBean(), this.slide);
    slide.name = slide.name + " - copy"
    this.dataSlidesService.Add(slide).subscribe(
      (data) => {
        this.slidesStoreService.dispatch(new AddSlidesAction(
          data
        ));
        this.slidesStream.subscribe(
          (element: SlideBean[]) => {
            let duplicate = _.find(element, (item) => {
              return item.id === data.id
            })
            this.slideStoreService.dispatch(new SelectSlideAction(
              duplicate
            ));
          },
          error => {
            console.error(error);
          },
          () => {
          }
        );
      }
    );
  }

  /**
   * delete current
   * @param data 
   */
  protected onDelete(event: any) {
    this.dataSlidesService.Delete(this.slide.id).subscribe(
      (data) => {
        this.slidesStoreService.dispatch(new DeleteSlidesAction(
          this.slide.id
        ));
        this.slidesStream.subscribe(
          (element: SlideBean[]) => {
            this.slideStoreService.dispatch(new SelectSlideAction(
              element[0]
            ));
          },
          error => {
            console.error(error);
          },
          () => {
          }
        );
      }
    );
  }

  /**
   * selection handler
   * @param data 
   */
  protected onSave() {
    let updated: SlideBean
    this.dataSlidesService.Update(this.slide.id, this.slide)
      .subscribe(
      (data: SlideBean) => updated = data,
      error => this.logger.error("While updating", this.slide, error),
      () => {
        this.slideStoreService.dispatch(new SelectSlideAction(
          updated
        ));
      });
  }

  /**
   * next
   * @param data 
   */
  protected onNext(event: any) {
    let index = _.findIndex(this.slides, (item) => {
      return item.id === this.slide.id
    })
    index++
    if(index > this.slides.length - 1) {
      index = 0;
    }
    this.slideStoreService.dispatch(new SelectSlideAction(
      this.slides[index]
    ));
  }

  /**
   * prev
   * @param data 
   */
  protected onPrev(event: any) {
    let index = _.findIndex(this.slides, (item) => {
      return item.id === this.slide.id
    })
    index--
    if(index < 0) {
      index = this.slides.length - 1;
    }
    this.slideStoreService.dispatch(new SelectSlideAction(
      this.slides[index]
    ));
  }

  /**
   * open in a new window the current presentation
   * @param data 
   */
  protected onOpenDocument(event: any) {
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
        this.slideStoreService.dispatch(new SelectSlideAction(
          slides[0]
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
