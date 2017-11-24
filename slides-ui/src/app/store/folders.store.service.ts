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

import { ActionReducer, Action, State } from '@ngrx/store';

import * as _ from 'lodash';

import { FolderBean } from '../models/common/folder-bean';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

/**
 * main store for this application
 */
export class FoldersStoreService {

  /**
   * FoldersStoreServiceReducer
   * @param state 
   * @param action 
   */
    public static reducer(state: Array<FolderBean> = new Array<FolderBean>(), action: ActionWithPayload<Array<FolderBean>>): Array<FolderBean> {
        switch (action.type) {
            /**
             * message incomming
             */
            case 'push':
                {
                    let newState = new Array<FolderBean>();
                    _.each(action.payload,(element) => {
                      newState.push(element);
                    });
                    return newState;
                }

            default:
                return state;
        }
    }

}