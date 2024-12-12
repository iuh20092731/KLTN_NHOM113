export type RealEstatePost = {
  views: number;
  createdAt(createdAt: any): unknown;
  id(id: (id: any) => unknown): void;
  id(id: any): unknown;
  timeAgo(timeAgo: any): unknown;
  postType: string;
  content: string;
  isAnonymous: boolean;
}