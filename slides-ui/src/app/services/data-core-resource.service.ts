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

import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';

import { DefaultResource } from '../interfaces/default-resources';
import { SecurityService } from '../services/security.service';
import { DataStoreService } from '../services/data-store.service';
import { ConfigurationService } from '../services/configuration.service';

/**
 * data model
 */
import { EntityBean } from '../models/common/entity-bean';

/**
 * default class to handle default behaviour or resource
 * component
 */
export class DataCoreResource<T extends EntityBean> implements DefaultResource<T> {

    protected actionUrl: string;
    protected headers: Headers;
    protected http: Http;
    protected configuration: ConfigurationService;

    /**
     * constructor
     */
    constructor(_configuration: ConfigurationService, actionUrl: string, _http: Http) {
        this.http = _http;
        this.actionUrl = actionUrl;
        this.configuration = _configuration;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('AuthToken', this.configuration.getAuthToken());
    }

    /**
     * execute remote task on this resource
     */
    public Tasks = (task: string, args: any): Observable<any> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.post(this.actionUrl + '?task=' + task, JSON.stringify(args), { headers: this.headers })
            .map((response: Response) => <any> response.json())
            .catch(this.handleError);
    }

    /**
     * execute remote task on this resource
     */
    public Task = (id: string, task: string, args: any): Observable<any> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.post(this.actionUrl + '/' + id + '?task=' + task, JSON.stringify(args), { headers: this.headers })
            .map((response: Response) => <any> response.json())
            .catch(this.handleError);
    }

    /**
     * execute remote task on this resource
     */
    public TaskAsXml = (id: string, task: string, args: any): Observable<any> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.post(this.actionUrl + '/' + id + '?task=' + task, JSON.stringify(args), { headers: this.headers })
            .map((response: Response) => <any> response.text())
            .catch(this.handleError);
    }

    /**
     * get all resources
     */
    public GetAll = (): Observable<T[]> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((response: Response) => <T[]>response.json())
            .catch(this.handleError);
    }

    /**
     * get single resource
     */
    public GetSingle = (id: string): Observable<T> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.get(this.actionUrl + '/' + id, { headers: this.headers })
            .map((response: Response) => <T>response.json())
            .catch(this.handleError);
    }

    /**
     * add a new resource
     */
    public Add = (itemToAdd: T): Observable<T> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.post(this.actionUrl, JSON.stringify(itemToAdd), { headers: this.headers })
            .map((response: Response) => <T>response.json())
            .catch(this.handleError);
    }

    /**
     * update this resource
     */
    public Update = (id: string, itemToUpdate: T): Observable<T> => {
        this.headers.append('AuthToken', this.configuration.getAuthToken());
        return this.http.put(this.actionUrl + '/' + id, JSON.stringify(itemToUpdate), { headers: this.headers })
            .map((response: Response) => <T>response.json())
            .catch(this.handleError);
    }

    /**
     * delete this resource
     */
    public Delete = (id: string): Observable<T> => {
        this.headers.set('AuthToken', this.configuration.getAuthToken());
        return this.http.delete(this.actionUrl + '/' + id, { headers: this.headers })
            .map((response: Response) => <T>response.json())
            .catch(this.handleError);
    }

    /**
     * error handler
     */
    protected handleError(error: Response) {
        return Observable.throw(error || 'Server error');
    }
}