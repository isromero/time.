export interface Post {
  authorId: string;
  postContent: string;
  imageUrls?: string[];
  createdAt: Date;
}
