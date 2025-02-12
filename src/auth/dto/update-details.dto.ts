import { IsNotEmpty, IsString } from "class-validator";

class UpdateDetailsDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;
}

export { UpdateDetailsDto };
