import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { WpApiService } from '../../providers/wp-api'

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  /*gsUrl: SafeResourceUrl;

  constructor(public navCtrl: NavController, public sanitizer: DomSanitizer) {
    this.gsUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://www.groundsounds.com/')
  }*/

  public busyList: boolean = false;
  public posts: any;
  public test: string = 'test';

  constructor(public navCtrl: NavController, private wp: WpApiService) {
    this.getPosts();
  }

  getPosts(){
    this.busyList = true;
    this.wp.getPosts(1).subscribe(data => { this.busyList = false; this.posts = data;} );
    //this.test="done";
  }

}