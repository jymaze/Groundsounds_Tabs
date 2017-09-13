import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController, ViewController, ModalController } from 'ionic-angular';

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { WpApiService } from '../../providers/wp-api'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Post } from '../../models/post';
import { MediaPage } from './../media/media';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  loader: any;
  loaded: boolean = false;

  iframePresent: boolean = true;
  iframes: any = [];

  rawContent: string;
  safeContent: SafeHtml;
  title: string;

  name: string;
  avatar: string;

  iabOptions: string = "'location=no,toolbarposition=top,closebuttoncaption=< Back to App,suppressesIncrementalRendering=no,allowInlineMediaPlayback=yes,presentationstyle=fullscreen'";
  winOpenOptions: string = "'location=no'";

  public post: Post;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private wp: WpApiService, private sanitizer: DomSanitizer, private iab: InAppBrowser, 
              private modal: ModalController) {

  }

  ionViewDidLoad(){
    this.processPost();
  }

  ionViewWillEnter(){
    this.presentLoading();
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

  processPost(){
    let received = this.navParams.get("post");
    this.post = received;
    this.rawContent = this.post.content;
    //console.log("raw: " + this.rawContent);
    /*if( this.rawContent.match(/soundcloud.com/) ){
      console.log("soudcloud link detected");
      this.disableSoundCloudButtons();
    };
    if( this.rawContent.match(/bandcamp.com/) ){
      console.log("bandcamp link detected");
      this.disableBandCampButtons();
    ;}*/
    this.linksToInAppBrowser();
    this.replaceIframes();
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

  getIframes(){
    this.iframes = this.rawContent.match(/<\s?iframe(?:(?!youtube).)+\/iframe\s?>/g);
    console.log(this.iframes);
    let test_link = this.iframes[0].match(/"(http.+?)"/)[0];
    //this.presentModal();
    //this.iab.create(test_link);
    //window.open(test_link);
    console.log(test_link);
  }

  replaceIframes(){
    this.iframes = this.rawContent.match(/<\s?iframe.+\/iframe\s?>/g);
    console.log(this.iframes);
    if(!this.iframes){ //return if this.iframes is null
      return;
    }
    for (let i=0; i<this.iframes.length; i++){
      console.log(this.iframes[i]);
      let link = this.iframes[i].match(/src="(\S+?)"/)[1]; //captured element is at index 1
      //link = link.replace(/width: \d+(?:%|px);\s+height: \d+(?:%|px);/g, "width: 100%; height: 100%;");
      if(link.match(/youtube/)){
        link = link +"?playsinline=1";
      }
      if(link.match(/soundcloud/)){
        link = link.replace(/auto_play=false/g, "auto_play=true");
        link = link.replace(/hide_related=false/g, "hide_related=true");
        link = link.replace(/show_comments=true/g, "show_comments=false");
        link = link.replace(/download=true/g, "download=false");
        link = link + "&amp;download=false";
        link = link.replace(/visual=false/g, "visual=true");
        link = link + "&amp;visual=true";
      }
      console.log(link);
      let site = this.iframes[i].match(/src=".+\.(\S+?)\.com.+"/)[1];
      site = site.charAt(0).toUpperCase() + site.slice(1);
      let buttonTemplate=
      `<div class="play-button-container">
      <button class="play-button disable-hover button button-ios button-default button-default-ios button-large button-large-ios button-strong button-strong-ios button-ios-primary" color="red">
      <span class="button-inner" onClick=\"window.open('${link}', '_blank', ${this.iabOptions})\">
      Play on ${site} ▶ 
      </span><div class="button-effect"></div></button>
      </div>`;
      this.rawContent = this.rawContent.replace(this.iframes[i], buttonTemplate);
    }
  }

  /*disableSoundCloudButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    //console.log("cleaning soundcloud widget");
    this.rawContent = this.rawContent.replace(/(auto_play=(?:false|true))/g, "$1"+"&amp;liking=false&amp;buying=false&amp;sharing=false&amp;download=false");
    //console.log("after: " + this.rawContent);
  }

  disableBandCampButtons(){ // add parameters to soundcloud widget to hide buttons buy/share/like/download
    //console.log("cleaning bandcamp widget");
    this.rawContent = this.rawContent.replace(/\/size=large\//g, "/size=small/");
    this.rawContent = this.rawContent.replace(/width: \d+(?:%|px);\s+height: \d+(?:%|px);/g, "width: 100%; height: 42px;");
    this.rawContent = this.rawContent.replace(/width="\d+"\s+height="\d+"/g, "");
    this.rawContent = this.rawContent.replace(/seamless=""/g, "seamless");
    this.rawContent = this.rawContent.replace(/artwork=small/g, "");
    //console.log("after: " + this.rawContent);
  }

  disableLiveMixTapes(){
    this.rawContent = this.rawContent.replace(/width="\d+"\s+height="\d+"/g, "");
    this.rawContent = this.rawContent.replace( /scrolling="no"/g, 'scrolling="no" sharing="no"' ); //livemixtapes
  }*/

  linksToInAppBrowser(){
    //console.log("before: " + this.rawContent); // grab links and transform then into Angular 2 click event for InAppBrowser processing
    //this.rawContent = this.rawContent.replace(/href=("\S+")/g, "(click)=\'openWithInAppBrowser($1)\'");
    this.rawContent = this.rawContent.replace( /href="(\S+?)"/g, `onClick=\"window.open('$1', '_blank', ${this.iabOptions} )\"` );
    this.rawContent = this.rawContent.replace( /target=[\"\']_blank[\"\']/g, "" );
    this.rawContent = this.rawContent.replace( /rel="\S+?"/g, "" );
    this.rawContent = this.rawContent.replace(/<a.+?>.*?<img/g, "<a onClick=\"\"> <img"); // disable links on images
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
                          this.loader.dismiss(); //when avatar picture arrived, can presume time to display
    });
  }

  test(){
    console.log("clicked");
  }

  presentModal() {
    let mediaModal = this.modal.create(MediaPage, {iframe: this.iframes});
    mediaModal.present();
  }

}