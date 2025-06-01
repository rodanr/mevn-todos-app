export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export type RegisterUserOutput = {
  status: string;
  message: string;
};

export type LoginOutput = {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  token: string;
};
