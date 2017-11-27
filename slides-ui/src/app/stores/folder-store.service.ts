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
import { ActionReducer, Action, State } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import * as _ from 'lodash';

import { ActionWithPayload } from './action-with-payload';
import { FolderBean } from '../models/common/folder-bean';

/**
 * states
 */
export interface AppState {
  feature: FolderState;
}

export interface FolderState {
	folder: FolderBean;
}

/**
 * actions
 */
export class SelectFolderAction implements ActionWithPayload<FolderBean> {
  readonly type = 'SelectFolderAction';
  constructor(public payload: FolderBean) {}
}

export type AllFolderActions = SelectFolderAction;  

/**
 * main store for this application
 */
@Injectable()
export class FolderStoreService {

  public static getFolder: MemoizedSelector<object, FolderBean>;
  
  /**
   * 
   * @param _store constructor
   */
  constructor(
    private _store: Store<FolderState>
  ) {
    FolderStoreService.getFolder =  createSelector(createFeatureSelector<FolderState>('folder'), (state: FolderState) => state.folder); 
  }

  /**
   * select this store service
   */
  public select(): Store<FolderBean> {
    return this._store.select(FolderStoreService.getFolder);
  }
  
  /**
   * dispatch
   * @param action dispatch action
   */
  public dispatch(action: AllFolderActions) {
    this._store.dispatch(action);
  }

  /**
   * metareducer (Cf. https://www.concretepage.com/angular-2/ngrx/ngrx-store-4-angular-5-tutorial)
   * @param state 
   * @param action 
   */
  public static reducer(state: FolderState = {folder: new FolderBean()}, action: AllFolderActions): FolderState {
    switch (action.type) {
      /**
       * message incomming
       */
      case 'SelectFolderAction':
        {
          return {folder: action.payload};
        }

      default:
        return state;
    }
  }
}