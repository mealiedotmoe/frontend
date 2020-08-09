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

export interface User {
  "username": string,
  "discord_id": string,
  "birthday": string,
  "anilist": string,
  "waifu": string,
  "admin": boolean
}

export interface APIError {
  error: boolean;
}

export interface DecodedJWT {
  exp: number;
  isAdmin: boolean;
  sub: string;
  username: string;
};

export interface InfoPage {
  title: string;
  slug: string;
  content: string;
  author: string;
  last_edit: string;
  created_at: string;
  updated_at: string;
}
