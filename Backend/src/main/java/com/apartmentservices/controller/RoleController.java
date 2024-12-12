package com.apartmentservices.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.RoleRequest;
import com.apartmentservices.dto.response.RoleResponse;
import com.apartmentservices.services.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Role Controller", description = "APIs for managing roles / Các API để quản lý vai trò")
public class RoleController {
    RoleService roleService;

    @PostMapping
    @Operation(summary = "Create Role", description = "Create a new role / Tạo một vai trò mới")
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get All Roles", description = "Retrieve a list of all roles / Lấy danh sách tất cả các vai trò")
    ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    @DeleteMapping("/{role}")
    @Operation(summary = "Delete Role", description = "Delete a role by its name / Xóa một vai trò theo tên của nó")
    ApiResponse<Void> delete(@PathVariable String role) {
        roleService.delete(role);
        return ApiResponse.<Void>builder().build();
    }
}
