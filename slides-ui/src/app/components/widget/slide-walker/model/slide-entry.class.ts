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

import * as _ from 'lodash';
import { SlideWidget } from './slide-widget.class';
import { AbstractWidget } from './abstract-widget.class';
import { FolderBean } from '../../../../models/common/folder-bean';

export class SlideEntry {

  private folder: FolderBean;
  private widget: SlideWidget;

  constructor(folder: FolderBean, widget: SlideWidget) {
    this.folder = folder;
    this.widget = widget;
  }

  public getFolder(): FolderBean {
    return this.folder;
  }

  public getWidget(): SlideWidget {
    return this.widget;
  }
}