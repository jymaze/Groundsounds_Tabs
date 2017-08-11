// User model based on the structure of posts from WordPress REST API
export class Post {
  id: number;
  date: string;
  link: string;
  title: string;
  content: string;
  author: number; //author #
  name: string = " "; //author name
  avatar: string = "assets/img/default_avatar.png"; //author picture, with placeholder
  media: number; //media #
  picture: string = "assets/img/placeholder.png"; //link to picture, retrieved from media page, placeholder while loading

  constructor(id: number, date: string, link: string, title: string, content: string, media: number, author: number){
    this.id = id;
    this.date = date;
    this.link = link;
    this.title = title;
    this.content = content;
    this.media = media;
    this.author = author;
  }

  setAvatar(link: string){
    this.avatar = link;
  }

  setName(name: string){
    this.name = name;
  }

  setPicture(link: string){
    this.picture = link;
  }

}