import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('/roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get('/')
    public getAllRoles() {
        return this.rolesService.getAllRoles();
    }

    @Get('/:roleId')
    public getRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
        return this.rolesService.getRoleById(roleId);
    }

    @Post('/')
    public createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.createRole(createRoleDto);
    }

    @Delete('/:roleId')
    public async deleteRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
        const role = await this.rolesService.getRoleById(roleId);

        return this.rolesService.deleteRole(role);
    }
}
