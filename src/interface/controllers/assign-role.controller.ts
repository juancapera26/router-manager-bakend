// src/interface/controllers/assign-role.controller.ts
import {Controller, Post, Body, Inject} from '@nestjs/common';
import {AuthProvider} from '../../domain/auth/auth.provider';
import {AssignRoleDto} from './dto/assign-role.dto';

@Controller('auth')
export class AssignRoleController {
  constructor(
    @Inject('AuthProvider') private readonly authProvider: AuthProvider
  ) {}

  @Post('set-role')
  async setRole(@Body() body: AssignRoleDto): Promise<{success: boolean}> {
    await this.authProvider.setRole(body.uid, body.role);
    return {success: true};
  }
}
