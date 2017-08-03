import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Content } from 'ionic-angular';

import { WpApiService } from '../../providers/wp-api'
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Post } from '../../models/post';

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

  //private postsPerPage: number = 20;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private wp: WpApiService, private inAppBrowser: InAppBrowser) {

  }
  
  ionViewDidLoad(){
    console.log('page will enter')
    this.getPosts();
  }


  jsonToObjects(posts: any){
    console.log("jsonToPosts was called");
    let ret: any = [];
    for(let i=0; i<posts.length; i++){
      //console.log(i);
      let item = posts[i];
      //console.log("item looked at");
      //console.log(item);
      ret.push( new Post(item.id, item.date, item.link, item.title.rendered, item.featured_media) );
    };
    //console.log(ret[0]);
    return (ret);

  }

  getPosts(){
    this.busyList = true;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe( data => { this.busyList = false;
                                                     this.posts = this.jsonToObjects(data); 
                                                     this.content.scrollToTop(250);
                                                     this.getPicLinks();
                                                   },
                                           err => this.showAlert(),
                                           () => console.log('getPosts completed') );
  }

  getPicLinks(){
    console.log("getting pics");
    for (let i=0; i<this.posts.length; i++){
      this.wp.getPictureLink(this.posts[i].media)
             .subscribe( data => { this.posts[i].setPicture( data["guid"]["rendered"]); /*console.log(this.posts[i])*/;  } ); 
    };
  } 

  getNextPosts(){
    this.page += 1;
    this.content.scrollToTop(250);
    this.getPosts();
  }

  refreshPosts(refresher){
    this.page = 1;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe(data => { this.posts = this.jsonToObjects(data);
                                                    this.getPicLinks(); },
                                           err => {this.showAlert()},
                                           () => {console.log('refreshPosts completed'); refresher.complete();}
                                );
  }

  /*backToTop(){
    this.page = 1;
    this.getPosts();
  }*/

  itemTapped(post) { //delete ct-top-entry
  /*let passedPost = new Contact(contact)
  this.navCtrl.push(NetworkDetailsPage, {
                    contact: passedContact
                   });*/
    this.showAlert();
    console.log(post.link);
    let browser = this.inAppBrowser.create(post.link, "_blank", "location = no");
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
