export class CreateUserDbDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  refreshToken?: string;
}

export class UpdateAccessTokenDto {
  email: string;
  token: string;
}
