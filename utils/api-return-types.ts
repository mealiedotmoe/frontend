export interface IFAQ {
  title: string;
  id: number;
  tag: string;
  color: string;
}

export interface ISpecificFAQ {
  id: number,
  title: string,
  author: string,
  last_edit: string,
  content: string,
  tag: string,
  color: string,
  created_at: string,
  updated_at: string
}

export interface IInfoPost {
  title: string;
  slug: string;
  content: string;
}

export interface APIError {
  error: boolean;
}