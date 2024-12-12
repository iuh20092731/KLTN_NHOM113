package com.apartmentservices.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.apartmentservices.dto.request.RoleRequest;
import com.apartmentservices.dto.response.RoleResponse;
import com.apartmentservices.models.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
