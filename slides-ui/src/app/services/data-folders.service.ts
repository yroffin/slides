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

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { ConfigurationService } from './configuration.service';
import { DefaultResource, DefaultLinkResource } from '../interfaces/default-resources';
import { DataCoreResource } from './data-core-resource.service';

/**
 * data model
 */
import { FolderBean } from '../models/common/folder-bean';

@Injectable()
export class DataFoldersService extends DataCoreResource<FolderBean> implements DefaultResource<FolderBean> {
  constructor(
    private _http: Http,
    private _configuration: ConfigurationService
  ) {
    super(_configuration, _configuration.ServerWithApiUrl + 'folders', _http);
  }
}
