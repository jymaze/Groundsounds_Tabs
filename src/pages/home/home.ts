import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WpApiService } from '../../providers/wp-api'

//import { DomSanitizationService } from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public busyList: boolean = false;
  public posts: any = null;

  constructor(public navCtrl: NavController, private wp: WpApiService) {
    this.getPosts();
  }

  getPosts(){
    this.busyList = true;
    this.wp.getPosts().subscribe(data => { this.busyList = false; this.posts = data; });
  }

  refreshPosts(refresher){
    this.posts = null;
    this.wp.getPosts().subscribe(data => { this.posts = data; });
    refresher.complete();
  }

  itemTapped(post) {
  /*let passedPost = new Contact(contact)
  this.navCtrl.push(NetworkDetailsPage, {
                    contact: passedContact
                   });*/
  }

}
