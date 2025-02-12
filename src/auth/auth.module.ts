import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthMiddleWare } from "./auth.middleware";

import { diskStorage } from "multer";
import { extname } from "path";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: 7 * 24 * 60 * 60 * 1000 },
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads/auth",
        filename: (req, file, cb) => {
          const filename = `${file.fieldname}-${Date.now()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 8 * 1024 * 1024,
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleWare)
      .exclude(
        // {path: "auth/:profile-pic", method: RequestMethod.GET},
        { path: "auth/sign-up", method: RequestMethod.POST },
        { path: "auth/login", method: RequestMethod.POST }
      )
      .forRoutes(AuthController);
  }
}

