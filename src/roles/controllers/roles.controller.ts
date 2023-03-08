import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@Controller('/roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get('/user/:userId')
    public getUserRoles(@Param('userId', ParseIntPipe) userId: number) {
        return this.rolesService.getUserRoles(userId);
    }
}
