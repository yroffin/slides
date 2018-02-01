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
import * as _ from 'lodash';
import { DataSlidesService } from '../../../services/data-slides.service';
import { LoggerService } from '../../../services/logger.service';
import { SlideBean } from '../../../models/common/slide-bean';
import { Observable } from 'rxjs/Observable';
import { SlidesStoreService, AddSlidesAction, DeleteSlidesAction, SelectSlideAction } from '../../../stores/slides-store.service';
import { Store } from '@ngrx/store/src/store';
import { FoldersStoreService } from '../../../stores/folders-store.service';

@Component({
  selector: 'app-slide-browser',
  templateUrl: './slide-browser.component.html',
  styleUrls: ['./slide-browser.component.css']
})
export class SlideBrowserComponent implements OnInit {

  /**
   * internal streams and store
   */
  protected slidesStream: Store<SlideBean[]>;
  protected slides: SlideBean[]
  protected slideStream: Store<SlideBean>;
  protected slide: SlideBean

  /**
   * constructor
   * @param folderStoreService 
   * @param slidesStoreService 
   * @param slideStoreService 
   * @param dataSlidesService 
   * @param logger 
   */
  constructor(
    private foldersStoreService: FoldersStoreService,
    private slidesStoreService: SlidesStoreService,
    private dataSlidesService: DataSlidesService,
    private logger: LoggerService
  ) {
    /**
     * subscribe
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
     * subscribe
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
        this.slidesStoreService.dispatch(new SelectSlideAction(
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
            this.slidesStoreService.dispatch(new SelectSlideAction(
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
            this.slidesStoreService.dispatch(new SelectSlideAction(
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
        this.slidesStoreService.dispatch(new SelectSlideAction(
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
    if (index > this.slides.length - 1) {
      index = 0;
    }
    this.slidesStoreService.dispatch(new SelectSlideAction(
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
    if (index < 0) {
      index = this.slides.length - 1;
    }
    this.slidesStoreService.dispatch(new SelectSlideAction(
      this.slides[index]
    ));
  }

}
