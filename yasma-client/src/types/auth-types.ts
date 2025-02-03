export interface User {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthInfo {
  user: User;
  services: string[];
}
