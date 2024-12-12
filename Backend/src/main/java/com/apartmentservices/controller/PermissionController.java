package com.apartmentservices.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.PermissionRequest;
import com.apartmentservices.dto.response.PermissionResponse;
import com.apartmentservices.services.PermissionService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Permission Controller", description = "APIs for managing permissions / Các API để quản lý quyền")
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    @Operation(summary = "Create Permission", description = "Create a new permission / Tạo một quyền mới")
    ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.create(request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get All Permissions", description = "Retrieve a list of all permissions / Lấy danh sách tất cả các quyền")
    ApiResponse<List<PermissionResponse>> getAll() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAll())
                .build();
    }

    @DeleteMapping("/{permission}")
    @Operation(summary = "Delete Permission", description = "Delete a permission by its name / Xóa một quyền theo tên của nó")
    ApiResponse<Void> delete(@PathVariable String permission) {
        permissionService.delete(permission);
        return ApiResponse.<Void>builder().build();
    }
}
