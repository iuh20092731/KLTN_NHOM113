export interface Permission {
  name: string;
  description: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roles: Role[];
}

export interface UserResponse {
  code: number;
  message: string;
  result: User;
}

