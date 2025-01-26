import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string = "";
}

export { SignUpDto };
