package com.apartmentservices.mapper;

import org.mapstruct.Mapper;

import com.apartmentservices.dto.request.PermissionRequest;
import com.apartmentservices.dto.response.PermissionResponse;
import com.apartmentservices.models.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
