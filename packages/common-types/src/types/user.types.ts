export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type RegisterUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};
