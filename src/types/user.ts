export interface User {
  id: string;
  name: string;
  detail: string;
  roleId: string;
  roleName: string;
}

export interface CreateUser {
  name: string;
  password: string;
  roleId: string;
  detail: string;
}

export interface UpdateUser {
  id: string;
  name: string;
  roleId: string;
  detail: string;
}