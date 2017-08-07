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
      ret.push( new Post(item.id, item.date, item.link, item.title.rendered, item.content.rendered, item.featured_media) );
    };
    console.log(ret[0]);
    return (ret);

  }

  getPosts(){
    this.busyList = true;
    console.log('getting page ' + this.page)
    this.wp.getPosts(this.page).subscribe( data => { this.busyList = false;
                                                     this.posts = this.jsonToObjects(data); 
                                                     this.content.scrollToTop(250);
                                                     this.getPicLinksByRegex();
                                                   },
                                           err => {this.busyList = false; this.showAlert()},
                                           () => console.log('getPosts completed') );
  }

  /*getPicLinksByApi(){
    console.log("getting pics by API");
    for (let i=0; i<this.posts.length; i++){
      this.wp.getPictureLink(this.posts[i].media)
             .subscribe( data => { this.posts[i].setPicture( data["guid"]["rendered"]); } ); 
    };
  }*/

  getPicLinksByRegex(){
    console.log("getting pics by Regex");
    for (let i=0; i<this.posts.length; i++){
      let regex = /href="([\S]+)"/; // match any address ending with picture extension
      let picLink = this.posts[i].content.match(/(?:href|src)="(\S+\.(?:jpg|jpeg|gif|png))"/);
      if(picLink){
        this.posts[i].setPicture(picLink[1]);
      }
      else{ // fallback on querying the api for media if no picture found (if only video in post)
        this.wp.getPictureLink(this.posts[i].media)
             .subscribe( data => { this.posts[i].setPicture( data["guid"]["rendered"]); } );
      }
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
                                                    this.getPicLinksByRegex(); 
                                                  },
                                           err => {refresher.complete(); this.showAlert()},
                                           () => {console.log('refreshPosts completed'); refresher.complete();}
                                );
  }

  /*backToTop(){
    this.page = 1;
    this.getPosts();
  }*/

  itemTapped(post) { //delete class ct-top-entry from id masthead
  /*let passedPost = new Contact(contact)
  this.navCtrl.push(NetworkDetailsPage, {
                    contact: passedContact
                   });*/
    if(this.busyList){
      return
    }
    console.log("getting that post: " + post.link);
    let browser = this.inAppBrowser.create(post.link, "_blank", 
                "location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no");
    /*browser.on('loadstop').subscribe( () => { browser.insertCSS( { code: ".ct-top-entry, .row{display:none !important;}" } ) },
                                              err=> {console.log(err)} );*/
    //browser.insertCSS( { code: "#secondary{display:none !important;}" } );
  
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
