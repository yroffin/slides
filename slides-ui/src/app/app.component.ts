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

import { FolderStoreService, SelectFolderAction } from './stores/folder-store.service';

import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: MenuItem[];

  constructor(
    private folderStoreService: FolderStoreService
  ) {

  }

  ngOnInit() {
    this.items = [
      { label: 'Stats', icon: 'fa-bar-chart' },
      { label: 'Calendar', icon: 'fa-calendar' },
      { label: 'Documentation', icon: 'fa-book' },
      { label: 'Support', icon: 'fa-support' },
      { label: 'Social', icon: 'fa-twitter' }
    ];

    this.folderStoreService.dispatch(new SelectFolderAction(
      {
        'id': 'teszaet',
        'name': 'default',
        'slides': [
          {
            'id': '1',
            'title': 'titre 1',
            'subtitle': 'subtitle 1',
            'body': 'data ... todo ...',
            slides: [
              {
                'id': '1.1',
                'title': 'title 1.a',
                'subtitle': 'subtitle 1.a',
                'body': 'data ... todo ... zaezeazazezae<p>qsdsqmdlksd</p>',
                slides: [
                ]
              },
              {
                'id': '1.2',
                'title': 'title 1.b',
                'subtitle': 'subtitle 1.b',
                'body': 'data ... xxx ...',
                slides: [
                ]
              }
            ]
          },
          {
            'id': '2',
            'title': 'title 2',
            'subtitle': 'subtitle default',
            'body': 'data ... todo ...',
            slides: [
              {
                'id': '2.1',
                'title': 'title 2.a',
                'subtitle': 'subtitle 2.a',
                'body': 'data ... todo ...',
                slides: [
                ]
              },
              {
                'id': '2.2',
                'title': 'title 2.b',
                'subtitle': 'subtitle 2.b',
                'body': 'data ... ttttt ...',
                slides: [
                ]
              }
            ]
          }
        ]
      }
    ));
  }
}
