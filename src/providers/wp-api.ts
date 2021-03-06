import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

//import { Post } from '../models/post';

import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

/*
  Generated class for the WpApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class WpApiService {

  private url: string = 'http://www.groundsounds.com/wp-json/wp/v2/'; //?per_page=50
  //private postsPerPage: number = 20;
  //public posts: any;
  //public rawPosts: any;

  constructor(public http: Http, private sanitizer: DomSanitizer) {
    //console.log('Hello WpApiService Provider');
  }

  /*getRawPosts(){
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.urlPosts)//.retry(5) // with retry 5 times
        //.map(res => <Post[]>res.json()) // cast to array of post objects
        //.map(res => res.json()) // cast to array of post objects
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.rawPosts = data; // the api returns a results object
          //for (let i = 0; i < this.posts.length; i++){
          //this.posts[i].content.rendered = this.sanitizer.sanitize(SecurityContext.HTML, this.posts[i].content.rendered);
          resolve(this.rawPosts);
        });
    });
  }*/

  getPosts(page: number, perPage: number, searchTerm: string){

    //this.posts = null;

    let target = this.url + "posts?" + "page=" + String(page) + "&per_page="+
             String(perPage) +"&" + String(Date.now()) + "&search=" + searchTerm; // url with page number and ajax timestamp to avoid caching
    
    let postsJSON = this.http.get( target ).retry(5)
                         .map(response => {
                          let nPages = parseInt(response.headers.toJSON()["x-wp-totalpages"]);
                          return [nPages, response.json()];
                        }); // return observable cast to array of objects
    return postsJSON;

  }

  getPictureLink(media: number){
    let target = this.url + "media/" + String(media);

    let mediaJSON = this.http.get( target ).retry(5)
                           .map(res => res.json());
    return mediaJSON;
  }

  getAuthor(author: number){
    let target = this.url + "users/" + String(author);
    //console.log(target);
    let authorJSON = this.http.get( target ).retry(5)
                           .map(res => res.json());
    return authorJSON;
  }

}
