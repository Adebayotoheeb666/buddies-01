export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  university_id?: string;
  graduation_year?: number;
  major?: string;
  class_year?: "Freshman" | "Sophomore" | "Junior" | "Senior";
  pronouns?: string;
  interests?: string[];
  verification_status?: "verified" | "pending" | "unverified";
  is_graduated?: boolean;
  profile_visibility?: "public" | "friends" | "private";
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
