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

import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/common/home/home.component';

import { ConfigurationService } from './services/configuration.service';
import { DataCoreService } from './services/data-core.service';
import { DataSlidesService } from './services/data-slides.service';
import { DataStoreService } from './services/data-store.service';
import { SecurityService } from './services/security.service';
import { WindowService } from './services/window.service';
import { LoggerService } from './services/logger.service';

/**
 * material2
 */
import { MatSidenavModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatTableModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatOptionModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';

/**
 * primeng
 */
import { ButtonModule, OrderListModule, EditorModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { MenubarModule, MenuModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';

/**
 * guard
 */
import { ProfileGuard } from './guards/profile.guard';

/**
 * stores
 */
import { FolderStoreService } from './stores/folder-store.service';
import { SlideStoreService } from './stores/slide-store.service';
import { SlideWalkerComponent } from './components/widget/slide-walker/slide-walker.component';
import { SlidePresenterComponent } from './components/widget/slide-presenter/slide-presenter.component';
import { SlideBrowserComponent } from './components/widget/slide-browser/slide-browser.component';

/**
 * default route definition
 */
const appRoutes: Routes = [
  { path: 'browser', component: SlideBrowserComponent, canActivate: [ProfileGuard] },
  { path: '', component: HomeComponent, canActivate: [ProfileGuard] },
  { path: '**', component: HomeComponent, canActivate: [ProfileGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SlideWalkerComponent,
    SlidePresenterComponent,
    SlideBrowserComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    /**
     * material2
     */
    MatSidenavModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    /**
     * primeface
     */
    DataTableModule,
    SharedModule,
    MenuModule,
    MenubarModule,
    CheckboxModule,
    InputTextModule,
    AccordionModule,
    CodeHighlighterModule,
    InputTextareaModule,
    DataListModule,
    TabViewModule,
    OrderListModule,
    EditorModule,
    DataGridModule,
    PanelModule,
    GrowlModule,
    MessagesModule,
    StepsModule,
    ButtonModule,
    PanelMenuModule,
    DialogModule,
    FieldsetModule,
    DropdownModule,
    ConfirmDialogModule,
    SplitButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeTableModule,
    ChartModule,
    CalendarModule,
    SpinnerModule,
    SliderModule,
    ToggleButtonModule,
    TabMenuModule,
    /**
     * routes
     */
    RouterModule.forRoot(appRoutes, { enableTracing: environment.enableTracing }),
    /**
     * store
     */
    StoreModule.forRoot({
      slide: SlideStoreService.reducer,
      folder: FolderStoreService.reducer
    })
  ],
  providers: [
    /**
     * guards
     */
    ProfileGuard,
    /**
     * stores
     */
    FolderStoreService,
    SlideStoreService,
    ConfigurationService,
    DataSlidesService,
    DataStoreService,
    SecurityService,
    WindowService,
    LoggerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public static metareducer(state: any, action: any): any {
    console.log('state', state);
    console.log('action', action);
    return state;
  }
}
