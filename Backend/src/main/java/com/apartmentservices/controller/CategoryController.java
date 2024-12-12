package com.apartmentservices.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.CategoryCreationRequest;
import com.apartmentservices.dto.request.CategoryUpdateRequest;
import com.apartmentservices.dto.response.CategoryResponse;
import com.apartmentservices.services.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Category Controller", description = "APIs for managing categories in the system / Các API quản lý danh mục trong hệ thống")
public class CategoryController {

    CategoryService categoryService;

    @Operation(summary = "Create Category", description = "Create a new category / Tạo mới danh mục")
    @PostMapping
    ApiResponse<CategoryResponse> createCategory(@RequestBody @Valid CategoryCreationRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @Operation(summary = "Get All Categories", description = "Retrieve a list of all categories ordered by sequence / Lấy danh sách tất cả các danh mục được sắp xếp theo thứ tự")
    @GetMapping
    ApiResponse<List<CategoryResponse>> getCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryService.getAllCategoriesOrderedBySeq())
                .build();
    }

    @Operation(summary = "Get Category by ID", description = "Retrieve a category by its ID / Lấy thông tin danh mục theo ID")
    @GetMapping("/{categoryId}")
    ApiResponse<CategoryResponse> getCategory(@PathVariable("categoryId") Integer categoryId) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategory(categoryId))
                .build();
    }

    @Operation(summary = "Delete Category", description = "Delete a category by its ID / Xóa danh mục theo ID")
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<String> deleteCategory(@PathVariable Integer categoryId) {
        categoryService.deleteCategory(categoryId);
        return ApiResponse.<String>builder()
                .result("Category has been deleted / Danh mục đã được xóa")
                .build();
    }

    @Operation(summary = "Update Category", description = "Update an existing category by its ID / Cập nhật danh mục hiện có theo ID")
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<CategoryResponse> updateCategory(
            @PathVariable Integer categoryId,
            @RequestBody @Valid CategoryUpdateRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategory(categoryId, request))
                .build();
    }

    @Operation(summary = "Update Category Status", description = "Update the isActive status of a category / Cập nhật trạng thái isActive của danh mục")
    @PutMapping("/{categoryId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<CategoryResponse> updateCategoryStatus(
            @PathVariable Integer categoryId,
            @RequestBody Boolean isActive) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.updateCategoryStatus(categoryId, isActive))
                .build();
    }
}
