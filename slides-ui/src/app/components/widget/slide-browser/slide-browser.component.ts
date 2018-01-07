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
import { DataSlidesService } from '../../../services/data-slides.service';
import { LoggerService } from '../../../services/logger.service';
import { SlideBean } from '../../../models/common/slide-bean';
import { SlideStoreService, SelectSlideAction } from '../../../stores/slide-store.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-slide-browser',
  templateUrl: './slide-browser.component.html',
  styleUrls: ['./slide-browser.component.css']
})
export class SlideBrowserComponent implements OnInit {

  protected slideStream: Observable<SlideBean> = new Observable<SlideBean>();
  protected slide: SlideBean = <SlideBean>{ body: '' };

  constructor(
    private slideStoreService: SlideStoreService,
    private dataSlidesService: DataSlidesService,
    private logger: LoggerService
  ) {
    /**
     * find the folder store
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
  }
}
