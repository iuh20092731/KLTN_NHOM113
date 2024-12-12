package com.apartmentservices.controller;

import java.util.List;

import com.apartmentservices.dto.request.MainAdvertisementUpdateRequest_V2;
import com.apartmentservices.dto.response.*;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.models.MainAdvertisement;
import com.apartmentservices.services.AdvertisementServiceService;
import jakarta.validation.Valid;

import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.MainAdvertisementCreationRequest;
import com.apartmentservices.dto.request.MainAdvertisementUpdateRequest;
import com.apartmentservices.services.MainAdvertisementService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v2/main-advertisements")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Main Advertisement Controller", description = "APIs for managing main advertisements / Các API để quản lý quảng cáo chính")
public class MainAdvertisementController_V2 {

    MainAdvertisementService mainAdvertisementService;
    AdvertisementServiceService advertisementServiceService;

    @PutMapping("/{advertisementId}")
    @Operation(summary = "Update Main Advertisement",
            description = "Update an existing main advertisement - Cập nhật một quảng cáo chính hiện có")
    ApiResponse<MainAdvertisementResponse> updateMainAdvertisement(
            @PathVariable Integer advertisementId,
            @RequestBody @Valid MainAdvertisementUpdateRequest_V2 request) {
        return ApiResponse.<MainAdvertisementResponse>builder()
                .result(mainAdvertisementService.updateAdvertisement_V2(advertisementId, request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get All Main Advertisements",
            description = "Retrieve a paginated list of main advertisements with optional status filter - Lấy danh sách phân trang các quảng cáo chính có thể lọc trạng thái")
    ApiResponse<Page<MainAdvertisementResponse>> getMainAdvertisements(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "adStatus", required = false) MainAdvertisement.AdStatus adStatus
    ) {
        return ApiResponse.<Page<MainAdvertisementResponse>>builder()
                .result(mainAdvertisementService.getAllAdvertisementspagination(page, size, adStatus))
                .build();
    }



    @GetMapping("/top-restaurants")
    @Operation(summary = "Get Top Restaurants by Service ID",
            description = "Get the top N restaurants by service ID with priority criteria of clicks, views, likes, shares, and saved / Lấy danh sách N quán ăn nổi bật theo service ID dựa trên các tiêu chí clicks, views, likes, shares, và saved")
    public ApiResponse<List<MainAdvertisementResponse>> getTopRestaurantsByServiceId(
            @RequestParam Integer serviceId,
            @RequestParam(defaultValue = "10") int limit) {

        List<MainAdvertisementResponse> topAdvertisements = mainAdvertisementService.getTopRestaurantsByServiceId(serviceId, limit);
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(topAdvertisements)
                .build();
    }


    @PostMapping
    @Operation(summary = "Create Main Advertisement", description = "Create a new main advertisement / Tạo một quảng cáo chính mới")
    ApiResponse<MainAdvertisementResponse_V2> createMainAdvertisement_V2(@RequestBody @Valid MainAdvertisementCreationRequest request) {
        return ApiResponse.<MainAdvertisementResponse_V2>builder()
                .result(mainAdvertisementService.createAdvertisement_V2(request))
                .build();
    }

    @GetMapping("/{advertisementId}")
    @Operation(summary = "Get Main Advertisement", description = "Retrieve details of a specific main advertisement / Lấy thông tin chi tiết của một quảng cáo chính cụ thể")
    ApiResponse<MainAdvertisementDetailResponse> getMainAdvertisement(@PathVariable("advertisementId") Integer advertisementId) {
        return ApiResponse.<MainAdvertisementDetailResponse>builder()
                .result(mainAdvertisementService.getAdvertisement_V2(advertisementId))
                .build();
    }

//    @GetMapping("/top-best")
//    public ApiResponse<List<MainAdvertisementTopResponse>> getTop3BestAdvertisements() {
//        List<MainAdvertisementTopResponse> topAdvertisements = mainAdvertisementService.getTop5BestAdvertisements_V2();
//        return ApiResponse.<List<MainAdvertisementTopResponse>>builder()
//                .result(topAdvertisements)
//                .build();
//    }

    @GetMapping("/top-best")
    @Operation(summary = "Get Top 3 Best Advertisements by Category ID", description = "Retrieve the top 3 best advertisements for a specific category ID / Lấy top 3 quảng cáo tốt nhất theo ID danh mục cụ thể")
    public ApiResponse<List<MainAdvertisementTopResponse>> getTop3BestAdvertisements(@RequestParam("categoryId") int categoryId) {
        // Truyền categoryId vào service
        List<MainAdvertisementTopResponse> topAdvertisements = mainAdvertisementService.getTop3BestAdvertisements_V2(categoryId);
        return ApiResponse.<List<MainAdvertisementTopResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    @GetMapping("/top-bests")
    @Operation(summary = "Get Top 3 Best Advertisements by Category Name", description = "Retrieve the top 3 best advertisements for a specific category name / Lấy top 3 quảng cáo tốt nhất theo tên danh mục cụ thể")
    public ApiResponse<List<MainAdvertisementTopResponse>> getTop3BestAdvertisements(@RequestParam("categoryName") String categoryName) {
        // Truyền categoryId vào service
        List<MainAdvertisementTopResponse> topAdvertisements = mainAdvertisementService.getTop3BestAdvertisementsByCategoryName(categoryName);
        return ApiResponse.<List<MainAdvertisementTopResponse>>builder()
                .result(topAdvertisements)
                .build();
    }


    @GetMapping("/top-popular")
    @Operation(summary = "Get Top 5 Popular Advertisements by Category ID", description = "Retrieve the top 5 popular advertisements for a specific category ID / Lấy top 5 quảng cáo phổ biến theo ID danh mục cụ thể")
    public ApiResponse<List<MainAdvertisementTopResponse>> getTop5PopularAdvertisements(@RequestParam("categoryId") int categoryId) {
        List<MainAdvertisementTopResponse> topAdvertisements = mainAdvertisementService.getTop5PopularAdvertisements_V2(categoryId);
        return ApiResponse.<List<MainAdvertisementTopResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    @GetMapping("/top-populars")
    @Operation(summary = "Get Top 5 Popular Advertisements by Category Name", description = "Retrieve the top 5 popular advertisements for a specific category name / Lấy top 5 quảng cáo phổ biến theo tên danh mục cụ thể")
    public ApiResponse<List<MainAdvertisementTopResponse>> getTop5PopularAdvertisements(@RequestParam("categoryName") String categoryName) {
        List<MainAdvertisementTopResponse> topAdvertisements = mainAdvertisementService.getTop5PopularAdvertisementsByCategoryName(categoryName);
        return ApiResponse.<List<MainAdvertisementTopResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Get Advertisements by Service ID", description = "Retrieve advertisements related to a specific service ID / Lấy quảng cáo liên quan đến một ID dịch vụ cụ thể")
    ApiResponse<List<MainAdvertisementMiniResponse>> getAdvertisementsByServiceId_V2(@PathVariable("serviceId") Integer serviceId) {
        return ApiResponse.<List<MainAdvertisementMiniResponse>>builder()
                .result(mainAdvertisementService.getAdvertisementsByServiceId_V2(serviceId))
                .build();
    }

    @GetMapping("/service")
    @Operation(summary = "Get Advertisements by Service Name", description = "Retrieve advertisements related to a specific service name / Lấy quảng cáo liên quan đến một tên dịch vụ cụ thể")
    ApiResponse<List<MainAdvertisementResponse>> getAdvertisementsByServiceName(@RequestParam("serviceName") String serviceName) {
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(mainAdvertisementService.getAdvertisementsByServiceName_V2(serviceName))
                .build();
    }

    @GetMapping("/service2")
    @Operation(summary = "Get Advertisements by Service Name with Details", description = "Retrieve advertisements related to a specific service name with additional details / Lấy quảng cáo liên quan đến một tên dịch vụ cụ thể với thông tin chi tiết bổ sung")
    ApiResponse<ServiceAdvertisementResponse> getAdvertisementsByServiceName2(@RequestParam("serviceName") String serviceName) {
        List<MainAdvertisementResponse> advertisements = mainAdvertisementService.getAdvertisementsByServiceName_V2(serviceName);
        AdvertisementServiceResponse advertisementServiceByServiceNameNoDiacritics = advertisementServiceService.getAdvertisementServiceByServiceNameNoDiacritics(serviceName);
        // Xây dựng phản hồi với serviceName
        ServiceAdvertisementResponse response = ServiceAdvertisementResponse.builder()
                .serviceName(advertisementServiceByServiceNameNoDiacritics.getServiceName())
                .responseList(advertisements)
                .build();

        return ApiResponse.<ServiceAdvertisementResponse>builder()
                .result(response)
                .build();
    }


}
