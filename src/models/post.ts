// User model based on the structure of posts from WordPress REST API
export class Post {
  id: number;
  date: string;
  link: string;
  title: string;
  media: number; //media #
  picture: string; //link to picture, retrieved from media page

  constructor(id: number, date: string, link: string, title: string, media: number){
    this.id = id;
    this.date = date;
    this.link = link;
    this.title = title;
    this.media = media;
  }

  setPicture(link){
    this.picture = link;
  }
}