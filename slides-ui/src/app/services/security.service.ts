/* 
 * Copyright 2016 Yannick Roffin.
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
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';

import { ConfigurationService } from '../services/configuration.service';
import { DefaultResource } from '../interfaces/default-resources';
import { DataCoreResource } from '../services/data-core-resource.service';
import { WindowService } from '../services/window.service';

/**
 * data model
 */
import { EntityBean } from '../models/common/entity-bean';
import { Oauth2Bean, MeBean } from './../models/security/oauth2-bean';

@Injectable()
export class SecurityService extends DataCoreResource<EntityBean> implements DefaultResource<EntityBean> {

  /**
   * constructor
   */
  constructor(
    private _http: Http,
    private _router: Router,
    private _windowService: WindowService,
    private _ConfigurationService: ConfigurationService) {
    super(_ConfigurationService, _ConfigurationService.ServerWithUrl, _http);
  }

  /**
   * get connect resource
   */
  public Connect = (): Observable<boolean> => {
    return this.http.get(this.actionUrl + 'api/connect', { headers: this.headers })
      .map((response: Response) => <boolean> response.json())
      .catch(this.handleError);
  }

  /**
   * get me resource
   */
  public Me = (token: string): Observable<MeBean> => {
    this.headers.set('AuthToken', token);
    return this.http.get(this.actionUrl + 'api/profile/me', { headers: this.headers })
      .map((response: Response) => <MeBean> response.json())
      .catch(this.handleError);
  }

  /**
   * get oauth2 resource
   */
  public Oauth2 = (client: string): Observable<Oauth2Bean> => {
    return this.http.get(this.actionUrl + 'api/oauth2?client='+client+'&oauth2_redirect_uri=http://'+this._windowService.getHost())
      .map((response: Response) => <Oauth2Bean> response.json())
      .catch(this.handleError);
  }
}