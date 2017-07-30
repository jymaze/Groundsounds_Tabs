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
  public page: number = 1;

  constructor(public navCtrl: NavController, private wp: WpApiService) {

  }

  ionViewDidLoad(){
    console.log('page will enter')
    this.getPosts();
  }

  getPosts(){
    this.busyList = true;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe(data => { this.busyList = false; this.posts = data; },
                                           err => console.error(err),
                                           () => console.log('getPosts completed')
                                );
  }

  refreshPosts(refresher){
    this.page += 1;
    //this.posts = null;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe(data => { this.posts = data; },
                                           err => {console.error(err)},
                                           () => {console.log('refreshPosts completed'); refresher.complete();}
                                );
  }

  backToTop(){
    this.page = 1;
    this.getPosts();
  }

  itemTapped(post) {
  /*let passedPost = new Contact(contact)
  this.navCtrl.push(NetworkDetailsPage, {
                    contact: passedContact
                   });*/
  }

}
