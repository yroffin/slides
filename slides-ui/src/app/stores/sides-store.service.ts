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
import { SlideBean } from '../models/common/slide-bean';

/**
 * states
 */
export interface AppState {
  feature: SlideState;
}

export interface SlideState {
	slides: SlideBean[];
}

/**
 * actions
 */
export class LoadSlidesAction implements ActionWithPayload<SlideBean[]> {
  readonly type = 'LoadSlidesAction';
  constructor(public payload: SlideBean[]) {}
}

export type AllSlidesActions = LoadSlidesAction;  

/**
 * main store for this application
 */
@Injectable()
export class SlidesStoreService {

  public static getSlides: MemoizedSelector<object, SlideBean[]>;
  
  /**
   * 
   * @param _store constructor
   */
  constructor(
    private _store: Store<SlideState>
  ) {
    SlidesStoreService.getSlides =  createSelector(createFeatureSelector<SlideState>('slides'), (state: SlideState) => state.slides); 
  }

  /**
   * select this store service
   */
  public select(): Store<SlideBean[]> {
    return this._store.select(SlidesStoreService.getSlides);
  }
  
  /**
   * 
   * @param action dispatch action
   */
  public dispatch(action: AllSlidesActions) {
    this._store.dispatch(action);
  }

  /**
   * reducer (Cf. https://www.concretepage.com/angular-2/ngrx/ngrx-store-4-angular-5-tutorial)
   * @param state 
   * @param action 
   */
  public static reducer(state: SlideState = {slides: new Array<SlideBean>()}, action: AllSlidesActions): SlideState {
    switch (action.type) {
      /**
       * message incomming
       */
      case 'LoadSlidesAction':
        {
          return {slides: action.payload};
        }

      default:
        return state;
    }
  }
}