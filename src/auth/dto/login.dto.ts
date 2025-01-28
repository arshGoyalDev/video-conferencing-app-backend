import { IsEmail, IsNotEmpty } from "class-validator";

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsNotEmpty()
  password: string;
}

export { LoginDto };
