import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ email });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

//  import { Injectable } from '@nestjs/common';
//  import { JwtService } from '@nestjs/jwt';
//  import * as bcrypt from 'bcryptjs';
//  import { UsersService } from '../users/users.service';

//  @Injectable()
//  export class AuthService {
//    constructor(
//      private readonly usersService: UsersService,
//      private readonly jwtService: JwtService,
//    ) {}

//    async validateUser(username: string, password: string): Promise<any> {
//      const user = await this.usersService.findOne(username);
//      if (user && bcrypt.compareSync(password, user.password)) {
//        const { password, ...result } = user;
//        return result;
//      }
//      return null;
//    }

//    async login(user: any) {
//      const payload = { username: user.username, sub: user.id, role: user.role };
//      return {
//        access_token: this.jwtService.sign(payload),
//      };
//    }

//    async register(user: any) {
//      const hashedPassword = bcrypt.hashSync(user.password, 8);
//      return this.usersService.create({ ...user, password: hashedPassword });
//    }
//  }
