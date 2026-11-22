export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}