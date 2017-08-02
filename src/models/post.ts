// User model based on the structure of posts from WordPress REST API
export class Post {
  id: number;
  date: string;
  link: string;
  title: string;
  media: number; //media #
  picture: string = "assets/img/placeholder.png"; //link to picture, retrieved from media page, placeholder while loading

  constructor(id: number, date: string, link: string, title: string, media: number){
    this.id = id;
    this.date = date;
    this.link = link;
    this.title = title;
    this.media = media;
  }

  setPicture(link: string){
    this.picture = link;
  }
}