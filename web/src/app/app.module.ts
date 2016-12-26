import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { CodemirrorModule } from 'ng2-codemirror';

import 'codemirror';
import 'hammerjs';

import { AppComponent } from './app.component';
import { DialogContentComponent } from './shared/dialog-content/dialog-content.component';
import { ViewportComponent } from './viewport/viewport.component';
import { HeaderComponent } from './header/header.component';
import { EditorComponent } from './editor/editor.component';
import { PreviewComponent } from './preview/preview.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogContentComponent,
    ViewportComponent,
    HeaderComponent,
    EditorComponent,
    PreviewComponent,
    SidenavComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CodemirrorModule,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogContentComponent
  ]
})
export class AppModule { }
