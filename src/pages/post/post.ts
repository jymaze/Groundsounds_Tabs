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
              private wp: WpApiService, private sanitizer: DomSanitizer, private iab: InAppBrowser) {

  }

  ionViewDidLoad(){
    this.displayPost();
  }

  displayPost(){
    let received = this.navParams.get("post");
    this.post = received;
    this.rawContent = this.post.content;
    console.log("raw: " + this.rawContent);
    if( this.rawContent.match(/soundcloud.com/) ){
    this.disableSoundCloudButtons();
    };
    if( this.rawContent.match(/bandcamp.com/) ){
      this.disableBandCampButtons();
    ;}
    //this.linksToInAppBrowser();
    console.log("not sanitized: " + this.rawContent);
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.rawContent);
    //this.safeContent = this.sanitizer.sanitize(SecurityContext.NONE, this.rawContent);
    console.log("sanitized: " + this.safeContent);
    this.title = this.post.title;
  }

  disableSoundCloudButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    console.log("cleaning soundcloud widget");
    this.rawContent = this.rawContent.replace(/(auto_play=(?:false|true))/g, "$1"+"&amp;liking=false&amp;buying=false&amp;sharing=false&amp;download=false");
    //console.log("after: " + this.rawContent);
  }

  disableBandCampButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    console.log("cleaning bandcamp widget");
    this.rawContent = this.rawContent.replace(/\/size=large\//g, "/size=small/");
    this.rawContent = this.rawContent.replace(/width: \d+%;\s+height: \d+px;/g, "width: 100%; height: 42px;");
    this.rawContent = this.rawContent.replace(/width="\d+"\s+height="\d+"/g, "");
    this.rawContent = this.rawContent.replace(/seamless=""/g, "seamless");
    this.rawContent = this.rawContent.replace(/artwork=small/g, "");
    //console.log("after: " + this.rawContent);
  }

  linksToInAppBrowser(){
    let iabOptions: string = "'location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no,noopener=yes'";
    //console.log("before: " + this.rawContent); // grab links and transform then into Angular 2 click event for InAppBrowser processing
    //this.rawContent = this.rawContent.replace(/href=("\S+")/g, "(click)=\'openWithInAppBrowser($1)\'");
    this.rawContent = this.rawContent.replace( /href="(\S+)"/g, "onClick=\"window.open('$1', '_blank', " + iabOptions + ")\"" );
    this.rawContent = this.rawContent.replace( /target=[\"\']_blank[\"\']/g, "" );
    this.rawContent = this.rawContent.replace( /rel="\S+?"/g, "" );
    //this.rawContent = this.rawContent.replace(/<a /g, "<div class=\"pseudo-link\"");
    //this.rawContent = this.rawContent.replace(/<\/a> /g, "</div>");    
    //console.log("after: " + this.rawContent);
  }

  openWithInAppBrowser(link: string){
    console.log("IAB called");
    let browser = this.iab.create(link, "_blank", "location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no");
  }

  test(){
    console.log("clicked");
  }

}
