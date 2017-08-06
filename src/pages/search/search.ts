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

  gsUrl: SafeResourceUrl;
  gsTitle: string;

  public busyList: boolean = false;
  public posts: any;
  public test: string = 'test';

  constructor(public navCtrl: NavController, private wp: WpApiService, public sanitizer: DomSanitizer) {
    this.getPosts();
  }

  getPosts(){
    this.busyList = true;
    this.wp.getPosts(1).subscribe( data => { this.busyList = false; this.posts = data;
                                              this.gsUrl = this.sanitizer.bypassSecurityTrustHtml(this.posts[0].content.rendered)
                                              this.gsTitle = this.posts[0].title.rendered;
                                           } );
    //this.test="done";
  }

}