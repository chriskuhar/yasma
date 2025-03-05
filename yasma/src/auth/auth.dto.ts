import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// login DTO
export class LoginDto {
  email: string;
  password: string;
}

// create user DTO
export class UserDto {
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString({ message: 'Invalid email format' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Invalid first name format' })
  firstName: string;

  @IsString({ message: 'Invalid last name format' })
  lastName: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  password: string;
}
