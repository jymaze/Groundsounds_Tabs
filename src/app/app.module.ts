import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { SearchPage } from '../pages/search/search';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MediaPage } from '../pages/media/media';
import { PlayPage } from '../pages/play/play';
import { PostPage } from '../pages/post/post';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WpApiService } from '../providers/wp-api';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Keyboard } from "@ionic-native/keyboard";


@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    ContactPage,
    HomePage,
    MediaPage,
    PlayPage,
    PostPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    ContactPage,
    HomePage,
    MediaPage,
    PlayPage,
    PostPage,
    TabsPage
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WpApiService,
    ScreenOrientation,
    InAppBrowser
  ]
})
export class AppModule {}
