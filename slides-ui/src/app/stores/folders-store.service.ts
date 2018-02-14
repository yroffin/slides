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
import { FolderBean, FolderElementBean } from '../models/common/folder-bean';

/**
 * states
 */
export interface AppState {
  feature: FolderState;
}

export interface FolderState {
  folders: Array<FolderBean>;
  folder: FolderBean;
}

export class FolderLink {
  folder: FolderBean;
  folderElement: FolderElementBean;
}

export class FolderChildLink {
  id: string;
  folder: FolderBean;
  folderElement: FolderElementBean;
}

export class SlideReferenceLink {
  id: string;
  reference: string;
}

/**
 * actions
 */
export class LoadFoldersAction implements ActionWithPayload<Array<FolderBean>> {
  readonly type = 'LoadFoldersAction';
  constructor(public payload: Array<FolderBean>) { }
}

export class AddFolderAction implements ActionWithPayload<FolderLink> {
  readonly type = 'AddFolderAction';
  constructor(public payload: FolderLink) { }
}

export class InsertFolderAction implements ActionWithPayload<FolderLink> {
  readonly type = 'InsertFolderAction';
  constructor(public payload: FolderLink) { }
}

export class AppendChildFolderAction implements ActionWithPayload<FolderLink> {
  readonly type = 'AppendChildFolderAction';
  constructor(public payload: FolderChildLink) { }
}

export class InsertChildFolderAction implements ActionWithPayload<FolderLink> {
  readonly type = 'InsertChildFolderAction';
  constructor(public payload: FolderChildLink) { }
}

export class DeleteFolderAction implements ActionWithPayload<FolderBean> {
  readonly type = 'DeleteFolderAction';
  constructor(public payload: FolderBean) { }
}

export class UpdateFolderAction implements ActionWithPayload<FolderBean> {
  readonly type = 'UpdateFolderAction';
  constructor(public payload: FolderBean) { }
}

export class UpdateReferenceFolderAction implements ActionWithPayload<SlideReferenceLink> {
  readonly type = 'UpdateReferenceFolderAction';
  constructor(public payload: SlideReferenceLink) { }
}

export class SelectFolderAction implements ActionWithPayload<FolderBean> {
  readonly type = 'SelectFolderAction';
  constructor(public payload: FolderBean) { }
}

export class RefreshFolderAction implements ActionWithPayload<FolderBean> {
  readonly type = 'RefreshFolderAction';
  constructor(public payload: FolderBean) { }
}

export type AllFoldersActions = LoadFoldersAction | AddFolderAction | DeleteFolderAction | SelectFolderAction | InsertFolderAction | UpdateFolderAction | AppendChildFolderAction | InsertChildFolderAction | RefreshFolderAction | UpdateReferenceFolderAction;

/**
 * main store for this application
 */
@Injectable()
export class FoldersStoreService {

  private getFolders: MemoizedSelector<object, Array<FolderBean>>;
  private getFolder: MemoizedSelector<object, FolderBean>;

  /**
   * 
   * @param _store constructor
   */
  constructor(
    private _store: Store<FolderState>
  ) {
    this.getFolders = createSelector(createFeatureSelector<FolderState>('folders'), (state: FolderState) => state.folders);
    this.getFolder = createSelector(createFeatureSelector<FolderState>('folders'), (state: FolderState) => state.folder);
  }

  /**
   * select this store service
   */
  public folders(): Store<Array<FolderBean>> {
    return this._store.select(this.getFolders);
  }

  /**
   * select this store service
   */
  public folder(): Store<FolderBean> {
    return this._store.select(this.getFolder);
  }

  /**
   * dispatch
   * @param action dispatch action
   */
  public dispatch(action: AllFoldersActions) {
    this._store.dispatch(action);
  }

  /**
   * metareducer (Cf. https://www.concretepage.com/angular-2/ngrx/ngrx-store-4-angular-5-tutorial)
   * @param state 
   * @param action 
   */
  public static reducer(state: FolderState = { folders: new Array<FolderBean>(), folder: new FolderBean() }, action: AllFoldersActions): FolderState {

    switch (action.type) {
      /**
       * message incomming
       */
      case 'LoadFoldersAction':
        {
          return {
            folders: action.payload,
            folder: action.payload[0]
          };
        }

      case 'UpdateFolderAction':
        {
          let folders = Object.assign([], state.folders);
          let folder;
          let index = 0;
          _.each(folders, (element: FolderBean) => {
            if (element.id === action.payload.id) {
              folder = Object.assign({}, action.payload);
            }
            index++;
          });
          folders[index] = folder;
          return {
            folders: folders,
            folder: folder
          };
        }

      case 'InsertFolderAction':
        {
          let folders = Object.assign([], state.folders);
          let folder;
          _.each(folders, (element: FolderBean) => {
            if (element.id === action.payload.folder.id) {
              folder = Object.assign({}, element);
              element.children.splice(0, 0, action.payload.folderElement);
            }
          });
          return {
            folders: folders,
            folder: folder
          };
        }

      case 'AppendChildFolderAction':
        {
          let folders = Object.assign([], state.folders);
          let folder;
          _.each(folders, (element: FolderBean) => {
            if (element.id === action.payload.folder.id) {
              folder = Object.assign({}, element);
              _.each(element.children, (child: FolderBean) => {
                if (child.id === action.payload.id) {
                  child.children.splice(0, 0, action.payload.folderElement);
                }
              });
            }
          });
          return {
            folders: folders,
            folder: folder
          };
        }

      case 'InsertChildFolderAction':
        {
          let folders = Object.assign([], state.folders);
          let folder;
          _.each(folders, (element: FolderBean) => {
            if (element.id === action.payload.folder.id) {
              folder = Object.assign({}, element);
              _.each(element.children, (child: FolderBean) => {
                if (child.id === action.payload.id) {
                  child.children.push(action.payload.folderElement);
                }
              });
            }
          });
          return {
            folders: folders,
            folder: folder
          };
        }

      case 'AddFolderAction':
        {
          let folders = Object.assign([], state.folders);
          let folder;
          _.each(folders, (element: FolderBean) => {
            if (element.id === action.payload.folder.id) {
              folder = Object.assign({}, element);
              element.children.push(action.payload.folderElement);
            }
          });
          return {
            folders: folders,
            folder: folder
          };
        }

      case 'DeleteFolderAction':
        {
          let folders = Object.assign([], state.folders);
          _.remove(folders, (folder) => {
            return action.payload.id === folder.id
          });
          return {
            folders: folders,
            folder: folders[0]
          };
        }

      /**
       * message incomming
       */
      case 'SelectFolderAction':
        {
          return {
            folders: state.folders,
            folder: action.payload
          };
        }

      /**
       * message incomming
       */
      case 'RefreshFolderAction':
        {
          return {
            folders: state.folders,
            folder: state.folder
          };
        }

      /**
       * message incomming
       */
      case 'UpdateReferenceFolderAction':
        {
          let folder: FolderBean;
          let folders = Object.assign([], state.folders);
          _.each(folders, (element: FolderBean) => {
            _.each(element.children, (child: FolderElementBean) => {
              if (child.id === action.payload.id) {
                folder = Object.assign({}, element);;
                child.reference = action.payload.reference;
              }
            });
          });

          return {
            folders: folders,
            folder: folder
          };
        }

      default:
        return state;
    }
  }
}