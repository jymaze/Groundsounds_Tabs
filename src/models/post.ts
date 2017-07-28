// User model based on the structure of posts from WordPress REST API
export interface Post {
  id: number;
  date: string;
  modified: string;
  link: string;
  title: {rendered: string};
  content: {rendered: string};
}