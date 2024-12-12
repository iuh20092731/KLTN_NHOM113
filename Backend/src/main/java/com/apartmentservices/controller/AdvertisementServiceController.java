package com.apartmentservices.controller;

import java.util.List;

import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.success.ApiSuccessResponse;
import com.apartmentservices.success.SuccessCode;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.AdvertisementServiceCreationRequest;
import com.apartmentservices.dto.request.AdvertisementServiceUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.services.AdvertisementServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/v1/advertisement-services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Advertisement Service Controller", description = "APIs for managing advertisement services / Các API quản lý dịch vụ quảng cáo")
public class AdvertisementServiceController {

    AdvertisementServiceService advertisementServiceService;

    @Operation(summary = "Create Advertisement Service", description = "Create a new advertisement service / Tạo mới dịch vụ quảng cáo")
    @PostMapping
    ApiResponse<AdvertisementServiceResponse> createAdvertisementService(@RequestBody @Valid AdvertisementServiceCreationRequest request) {
        return ApiResponse.<AdvertisementServiceResponse>builder()
                .result(advertisementServiceService.createAdvertisementService(request))
                .build();
    }

    @Operation(summary = "Get All Advertisement Services", description = "Retrieve a list of all advertisement services / Lấy danh sách tất cả các dịch vụ quảng cáo")
    @GetMapping
    ApiResponse<List<AdvertisementServiceResponse>> getAdvertisementServices() {
        return ApiResponse.<List<AdvertisementServiceResponse>>builder()
                .result(advertisementServiceService.getAllAdvertisementServices())
                .build();
    }

    @Operation(summary = "Get Advertisement Service by ID", description = "Retrieve an advertisement service by its ID / Lấy thông tin dịch vụ quảng cáo theo ID")
    @GetMapping("/{serviceId}")
    ApiResponse<AdvertisementServiceResponse> getAdvertisementService(@PathVariable("serviceId") Integer serviceId) {
        return ApiResponse.<AdvertisementServiceResponse>builder()
                .result(advertisementServiceService.getAdvertisementService(serviceId))
                .build();
    }

    @Operation(summary = "Delete Advertisement Service", description = "Delete an advertisement service by its ID / Xóa dịch vụ quảng cáo theo ID")
    @DeleteMapping("/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<ApiSuccessResponse> deleteAdvertisementService(@PathVariable Integer serviceId) {
        advertisementServiceService.deleteAdvertisementService(serviceId);
        SuccessCode successCode = SuccessCode.ADVERTISEMENT_SERVICE_DELETED;
        return ResponseEntity.status(successCode.getStatus())
                .body(ApiSuccessResponse.builder()
                        .code(successCode.getCode())
                        .message(successCode.getMessage())
                        .build());
    }

    @Operation(summary = "Update Advertisement Service", description = "Update an existing advertisement service by its ID / Cập nhật dịch vụ quảng cáo hiện có theo ID")
    @PutMapping("/{serviceId}")
    ApiResponse<AdvertisementServiceResponse> updateAdvertisementService(
            @PathVariable Integer serviceId,
            @RequestBody @Valid AdvertisementServiceUpdateRequest request) {
        return ApiResponse.<AdvertisementServiceResponse>builder()
                .result(advertisementServiceService.updateAdvertisementService(serviceId, request))
                .build();
    }

    @Operation(summary = "Search Advertisement Services by Category", description = "Search advertisement services by category name / Tìm kiếm dịch vụ quảng cáo theo tên danh mục")
    @GetMapping("/category")
    public ApiResponse<List<AdvertisementServiceResponse>> searchAdvertisementServicesByCategory(
            @RequestParam("categoryName") String categoryName) {
        return ApiResponse.<List<AdvertisementServiceResponse>>builder()
                .result(advertisementServiceService.getAdvertisementServicesByCategoryName(categoryName))
                .build();
    }

    @Operation(summary = "Update Advertisement Service Status", description = "Update the isActive status of an advertisement service / Cập nhật trạng thái hoạt động của dịch vụ quảng cáo")
    @PatchMapping("/{serviceId}/status")
    ApiResponse<String> updateAdvertisementServiceStatus(
            @PathVariable Integer serviceId,
            @RequestBody Boolean isActive) {
        advertisementServiceService.updateAdvertisementServiceStatus(serviceId, isActive);
        return ApiResponse.<String>builder()
                .result("Advertisement service status has been updated / Trạng thái dịch vụ quảng cáo đã được cập nhật")
                .build();
    }

    @Operation(summary = "Get Advertisement Services by Category ID", description = "Retrieve advertisement services by category ID / Lấy danh sách dịch vụ quảng cáo theo ID danh mục")
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<AdvertisementServiceResponse>> getAdvertisementServicesByCategoryId(
            @PathVariable("categoryId") Integer categoryId) {
        List<AdvertisementServiceResponse> services = advertisementServiceService.getAdvertisementServicesByCategoryId(categoryId);
        return ApiResponse.<List<AdvertisementServiceResponse>>builder()
                .result(services)
                .build();
    }



}
