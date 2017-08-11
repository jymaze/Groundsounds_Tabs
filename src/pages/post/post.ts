import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

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

  loader: any;
  loaded: boolean = false;

  rawContent: string;
  safeContent: SafeHtml;
  title: string;

  name: string;
  avatar: string;

  public post: Post;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private wp: WpApiService, private sanitizer: DomSanitizer, private iab: InAppBrowser) {

  }

  ionViewWillEnter(){
    this.presentLoading();
    this.displayPost();
    this.getAuthor();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      showBackdrop: true,
      //duration: 1500
    });
    this.loader.present();
  }

  displayPost(){
    let received = this.navParams.get("post");
    this.post = received;
    this.rawContent = this.post.content;
    //console.log("raw: " + this.rawContent);
    if( this.rawContent.match(/soundcloud.com/) ){
    this.disableSoundCloudButtons();
    };
    if( this.rawContent.match(/bandcamp.com/) ){
      this.disableBandCampButtons();
    ;}
    this.linksToInAppBrowser();
    //console.log("not sanitized: " + this.rawContent);
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.rawContent);
    //this.safeContent = this.sanitizer.sanitize(SecurityContext.NONE, this.rawContent);
    //console.log("sanitized: " + this.safeContent);
    this.title = this.post.title;
    this.name = this.post.name;
    //console.log(this.name);
    this.avatar = this.post.avatar;
    //console.log(this.avatar);   
  }

  disableSoundCloudButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    //console.log("cleaning soundcloud widget");
    this.rawContent = this.rawContent.replace(/(auto_play=(?:false|true))/g, "$1"+"&amp;liking=false&amp;buying=false&amp;sharing=false&amp;download=false");
    //console.log("after: " + this.rawContent);
  }

  disableBandCampButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    //console.log("cleaning bandcamp widget");
    this.rawContent = this.rawContent.replace(/\/size=large\//g, "/size=small/");
    this.rawContent = this.rawContent.replace(/width: \d+%;\s+height: \d+px;/g, "width: 100%; height: 42px;");
    this.rawContent = this.rawContent.replace(/width="\d+"\s+height="\d+"/g, "");
    this.rawContent = this.rawContent.replace(/seamless=""/g, "seamless");
    this.rawContent = this.rawContent.replace(/artwork=small/g, "");
    //console.log("after: " + this.rawContent);
  }

  disableLiveMixTapes(){
    this.rawContent = this.rawContent.replace(/width="\d+"\s+height="\d+"/g, "");
    this.rawContent = this.rawContent.replace( /scrolling="no"/g, 'scrolling="no" sharing="no"' ); //livemixtapes
  }

  linksToInAppBrowser(){
    let iabOptions: string = "'location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no,noopener=yes'";
    //console.log("before: " + this.rawContent); // grab links and transform then into Angular 2 click event for InAppBrowser processing
    //this.rawContent = this.rawContent.replace(/href=("\S+")/g, "(click)=\'openWithInAppBrowser($1)\'");
    this.rawContent = this.rawContent.replace( /href="(\S+?)"/g, "onClick=\"window.open('$1', '_blank', " + iabOptions + ")\"" );
    this.rawContent = this.rawContent.replace( /target=[\"\']_blank[\"\']/g, "" );
    this.rawContent = this.rawContent.replace( /rel="\S+?"/g, "" );
    //this.rawContent = this.rawContent.replace(/<a /g, "<div class=\"pseudo-link\"");
    //this.rawContent = this.rawContent.replace(/<\/a> /g, "</div>");    
    //console.log("after: " + this.rawContent);
  }

  linksToInAppBrowserByQuery(){
    let iabOptions: string = "'location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no,noopener=yes'";
    let links = document.querySelectorAll("a");
    for(let i=0; i<links.length; i++){
      let link = links[i];
      let href = link.href;
      //console.log("processing link: " + href);
      link.onclick = function(e: MouseEvent, targetUrl=href){
        e.preventDefault();
        //let targetUrl = e.currentTarget.getAttribute("href");
        window.open(targetUrl, "_blank", iabOptions);
      }
    }
  }

  openWithInAppBrowser(link: string){
    //console.log("IAB called");
    let browser = this.iab.create(link, "_blank", "location=no,toolbarposition=bottom,closebuttoncaption=Back to GroundSounds,suppressesIncrementalRendering=no");
  }

  getAuthor(){
    //console.log(this.post.avatar);
    //console.log(this.post.name);
    //console.log("getting author");
    this.wp.getAuthor(this.post.author)
    .subscribe( data => { this.post.setAvatar( data["avatar_urls"]["48"] );
                          this.post.setName( data["name"] );
                          //console.log(this.post.name+" : "+this.post.avatar);
                          this.name = "by " + this.post.name;
                          this.avatar = this.post.avatar;
                          this.loaded = true;
                          this.loader.dismiss();
    });
  }


  test(){
    console.log("clicked");
  }

}
