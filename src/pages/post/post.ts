import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { WpApiService } from '../../providers/wp-api'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Post } from '../../models/post';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  rawContent: string;
  safeContent: SafeHtml;
  title: string;

  public post: Post;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private wp: WpApiService, private sanitizer: DomSanitizer, private IAB: InAppBrowser) {

  }

  ionViewDidLoad(){
    this.displayPost();
  }

  displayPost(){
    let received = this.navParams.get("post");
    //console.log(received);
    this.post = received;
    this.rawContent = this.post.content;
    this.disableSoundCloudButtons();
    this.linksToInAppBrowser();
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.rawContent);
    this.title = this.post.title;
  }

  disableSoundCloudButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    //console.log("before: " + this.rawContent);
    this.rawContent = this.rawContent.replace(/(auto_play=false)/g, "$1"+"&amp;liking=false&amp;buying=false&amp;sharing=false&amp;download=false");
    //console.log("after: " + this.rawContent);
  }

  linksToInAppBrowser(){
    console.log("before: " + this.rawContent); // grab links and transform then into Angular 2 click event for InAppBrowser processing
    //this.rawContent = this.rawContent.replace(/href=("\S+")/g, "(click)=\'openWithInAppBrowser($1)\'");
    this.rawContent = this.rawContent.replace(/href="(\S+)"/g, "onClick=\"window.open('$1', '_blank')\"");
    this.rawContent = this.rawContent.replace(/target=[\"\']_blank[\"\']/g, "");
    this.rawContent = this.rawContent.replace(/rel="\S+?"/g, "");
    //this.rawContent = this.rawContent.replace(/<\/a> /, "</span>");    
    console.log("after: " + this.rawContent);
  }

  openWithInAppBrowser(link: string){
    console.log("IAB called");
    let browser = this.IAB.create(link, "_blank", "location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no");
  }

  test(){
    console.log("clicked");
  }

}
