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

import { FolderBean } from '../../../models/common/folder-bean';
import { FoldersStoreService } from '../../../stores/folders-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public folderStream: Observable<FolderBean> = new Observable<FolderBean>();

  constructor(
    private foldersStoreService: FoldersStoreService
  ) {
    /**
     * find the folder store
     */
    this.folderStream = this.foldersStoreService.folder();
  }

  ngOnInit() {
  }

}
