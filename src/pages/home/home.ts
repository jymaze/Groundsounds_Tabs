import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Content } from 'ionic-angular';

import { WpApiService } from '../../providers/wp-api'

//import { DomSanitizationService } from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Content) content: Content;

  public busyList: boolean = false;
  public posts: any = [];
  public page: number = 1;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private wp: WpApiService) {

  }
  
  ionViewDidLoad(){
    console.log('page will enter')
    this.getPosts();
  }


  ionView
  getPosts(){
    this.busyList = true;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe(data => { this.busyList = false; this.posts = data; },
                                           err => this.showAlert(),
                                           () => console.log('getPosts completed')
                                );
  }

  getNextPosts(){
    this.page += 1;
    this.content.scrollToTop(200);
    this.getPosts();
    this.content.scrollToTop(200);
  }

  refreshPosts(refresher){
    this.page = 1;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe(data => { this.posts = data; },
                                           err => {this.showAlert()},
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

  showAlert() {
  let alert = this.alertCtrl.create({
    title: 'Something went wrong...',
    subTitle: 'Data could not be loaded. Please check your network connection',
    buttons: ['OK']
  });
  alert.present();
  }

}
