export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type RegisterUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};
