import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { WpApiService } from '../../providers/wp-api'
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private wp: WpApiService, public sanitizer: DomSanitizer) {
    this.displayPost();
  }

  displayPost(){
    let received = this.navParams.get("post");
    //console.log(received);
    this.post = received;
    this.rawContent = this.post.content;
    this.disableSoundCloudLike();
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.rawContent);
    this.title = this.post.title;
  }

  disableSoundCloudLike(){
    console.log("before: " + this.rawContent);
    this.rawContent = this.rawContent.replace(/(auto_play=false)/, "$1" + "&amp;liking=false&amp;buying=false&amp;sharing=false&amp;download=false");
    console.log("after: " + this.rawContent);
  }

}
