export interface Post {
  id?: string;
  authorId: string;
  postContent: string;
  imageUrls?: string[];
  createdAt: Date;
}
