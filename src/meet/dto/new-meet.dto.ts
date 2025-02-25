import { IsNotEmpty, IsString } from "class-validator";

class NewMeetDto {
  @IsNotEmpty()
  @IsString()
  meetId: string;

  @IsNotEmpty()
  allowVideo: boolean;

  @IsNotEmpty()
  allowMic: boolean;

  @IsNotEmpty()
  anyoneCanJoin: boolean;
}

export { NewMeetDto };
