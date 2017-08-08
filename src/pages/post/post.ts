import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

import { WpApiService } from '../../providers/wp-api'
import { Post } from '../../models/post';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  content: any;
  title: string;

  public post: Post;

  constructor(public navCtrl: NavController, public navParams: NavParams, private wp: WpApiService, public sanitizer: DomSanitizer) {
    this.displayPost();
  }

  displayPost(){
    let received = this.navParams.get("post");
    console.log(received);
    this.post = received;
    this.content = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
    this.title = this.post.title;
  }

}
