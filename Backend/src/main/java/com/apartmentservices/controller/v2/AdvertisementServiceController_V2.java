package com.apartmentservices.controller.v2;


import java.util.List;

import com.apartmentservices.dto.request.AdvertisementServiceUpdateRequest;
import com.apartmentservices.dto.request.v2.AdvertisementServiceUpdateRequest_V2;
import com.apartmentservices.dto.response.AdvertisementServiceCategoryResponse;

import com.apartmentservices.dto.response.CategoryResponse;
import com.apartmentservices.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.services.AdvertisementServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api/v2/advertisement-services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Advertisement Service Controller", description = "APIs for managing advertisement services / Các API quản lý dịch vụ quảng cáo")
public class AdvertisementServiceController_V2 {

    AdvertisementServiceService advertisementServiceService;
    CategoryService categoryService;

    @Operation(summary = "Search Advertisement Services by Category", description = "Search advertisement services by category name / Tìm kiếm dịch vụ quảng cáo theo tên danh mục")
    @GetMapping("/category")
    public ApiResponse<AdvertisementServiceCategoryResponse> searchAdvertisementServicesByCategory(
            @RequestParam("categoryName") String categoryNameNoDiacritics) {

        CategoryResponse category = categoryService.getCategoryByCategoryNameNoDiacritics(categoryNameNoDiacritics);

        List<AdvertisementServiceResponse> services = advertisementServiceService.getAdvertisementServicesByCategoryName(categoryNameNoDiacritics);

        AdvertisementServiceCategoryResponse response = AdvertisementServiceCategoryResponse.builder()
                .categoryName(category.getCategoryName())
                .categoryNameNoDiacritics(category.getCategoryNameNoDiacritics())
                .services(services)
                .build();

        return ApiResponse.<AdvertisementServiceCategoryResponse>builder()
                .result(response)
                .build();
    }

    @Operation(summary = "Update Advertisement Service", description = "Update an existing advertisement service by its ID / Cập nhật dịch vụ quảng cáo hiện có theo ID")
    @PutMapping("/{serviceId}")
    ApiResponse<AdvertisementServiceResponse> updateAdvertisementService(
            @PathVariable Integer serviceId,
            @RequestBody @Valid AdvertisementServiceUpdateRequest_V2 request) {
        return ApiResponse.<AdvertisementServiceResponse>builder()
                .result(advertisementServiceService.updateAdvertisementService_V2(serviceId, request))
                .build();
    }


}
