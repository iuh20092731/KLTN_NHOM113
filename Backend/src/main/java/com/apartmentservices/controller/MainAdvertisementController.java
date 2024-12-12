package com.apartmentservices.controller;

import java.util.List;

import com.apartmentservices.dto.request.AdStatusUpdateRequest;
import com.apartmentservices.dto.response.MonthlyActiveAdvertisementStatsResponse;
import com.apartmentservices.dto.response.MonthlyAdvertisementStatsResponse;
import jakarta.validation.Valid;

import jakarta.websocket.server.PathParam;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.MainAdvertisementCreationRequest;
import com.apartmentservices.dto.request.MainAdvertisementUpdateRequest;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.services.MainAdvertisementService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/main-advertisements")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Main Advertisements", description = "API for managing main advertisements - API để quản lý quảng cáo chính")
public class MainAdvertisementController {

    MainAdvertisementService mainAdvertisementService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get Advertisements by User ID", description = "Retrieve all advertisements by user ID / Lấy tất cả quảng cáo theo user ID")
    public List<MainAdvertisementResponse> getAdvertisementsByUserId(@PathVariable String userId) {
        return mainAdvertisementService.getAdvertisementsByUserId(userId);
    }

    @PostMapping
    @Operation(summary = "Create Main Advertisement",
            description = "Create a new main advertisement - Tạo một quảng cáo chính mới")
    ApiResponse<MainAdvertisementResponse> createMainAdvertisement(@RequestBody @Valid MainAdvertisementCreationRequest request) {
        return ApiResponse.<MainAdvertisementResponse>builder()
                .result(mainAdvertisementService.createAdvertisement(request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get All Main Advertisements",
            description = "Retrieve a list of all main advertisements - Lấy danh sách tất cả quảng cáo chính")
    ApiResponse<List<MainAdvertisementResponse>> getMainAdvertisements() {
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(mainAdvertisementService.getAllAdvertisements())
                .build();
    }

    @GetMapping("/registered")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Main Advertisements by Status",
            description = "Retrieve main advertisements by advertisement status - Lấy quảng cáo chính theo trạng thái quảng cáo")
    ApiResponse<List<MainAdvertisementResponse>> getMainAdvertisementsByAdStatus(@PathParam("adStatus") String adStatus) {
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(mainAdvertisementService.getAllAdvertisementsAdStatus(adStatus))
                .build();
    }

    @GetMapping("/{advertisementId}")
    @Operation(summary = "Get Main Advertisement by ID",
            description = "Retrieve a main advertisement by its ID - Lấy quảng cáo chính theo ID")
    ApiResponse<MainAdvertisementResponse> getMainAdvertisement(@PathVariable("advertisementId") Integer advertisementId) {
        return ApiResponse.<MainAdvertisementResponse>builder()
                .result(mainAdvertisementService.getAdvertisement(advertisementId))
                .build();
    }

    @DeleteMapping("/{advertisementId}")
    @Operation(summary = "Delete Main Advertisement",
            description = "Delete a main advertisement by its ID - Xóa một quảng cáo chính theo ID")
    ApiResponse<String> deleteMainAdvertisement(@PathVariable Integer advertisementId) {
        mainAdvertisementService.deleteAdvertisement(advertisementId);
        return ApiResponse.<String>builder()
                .result("Main advertisement has been deleted")
                .build();
    }

    @PutMapping("/{advertisementId}")
    @Operation(summary = "Update Main Advertisement",
            description = "Update an existing main advertisement - Cập nhật một quảng cáo chính hiện có")
    ApiResponse<MainAdvertisementResponse> updateMainAdvertisement(
            @PathVariable Integer advertisementId,
            @RequestBody @Valid MainAdvertisementUpdateRequest request) {
        return ApiResponse.<MainAdvertisementResponse>builder()
                .result(mainAdvertisementService.updateAdvertisement(advertisementId, request))
                .build();
    }

    @GetMapping("/service/{serviceId}")
    @Operation(summary = "Get Advertisements by Service ID",
            description = "Retrieve main advertisements by service ID - Lấy quảng cáo chính theo ID dịch vụ")
    ApiResponse<List<MainAdvertisementResponse>> getAdvertisementsByServiceId(@PathVariable("serviceId") Integer serviceId) {
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(mainAdvertisementService.getAdvertisementsByServiceId(serviceId))
                .build();
    }

    @GetMapping("/top-food")
    @Operation(summary = "Get Top 5 Food Advertisements",
            description = "Retrieve the top 5 food advertisements - Lấy 5 quảng cáo thực phẩm hàng đầu")
    public ApiResponse<List<MainAdvertisementResponse>> getTop5FoodAdvertisements() {
        List<MainAdvertisementResponse> topAdvertisements = mainAdvertisementService.getTop5FoodAdvertisements();
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    @GetMapping("/top-best")
    @Operation(summary = "Get Top 5 Best Advertisements",
            description = "Retrieve the top 5 best advertisements - Lấy 5 quảng cáo tốt nhất")
    public ApiResponse<List<MainAdvertisementResponse>> getTop5BestAdvertisements() {
        List<MainAdvertisementResponse> topAdvertisements = mainAdvertisementService.getTop5BestAdvertisements();
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    @GetMapping("/top-popular")
    @Operation(summary = "Get Top 5 Popular Advertisements",
            description = "Retrieve the top 5 popular advertisements - Lấy 5 quảng cáo phổ biến nhất")
    public ApiResponse<List<MainAdvertisementResponse>> getTop5PopularAdvertisements() {
        List<MainAdvertisementResponse> topAdvertisements = mainAdvertisementService.getTop5PopularAdvertisements();
        return ApiResponse.<List<MainAdvertisementResponse>>builder()
                .result(topAdvertisements)
                .build();
    }

    // API để tăng số lượt xem
    @PostMapping("/{advertisementId}/view")
    @Operation(summary = "Increase Views",
            description = "Increase the view count of a main advertisement - Tăng số lượt xem của quảng cáo chính")
    public ApiResponse<String> increaseViews(@PathVariable("advertisementId") Integer advertisementId) {
        mainAdvertisementService.increaseViews(advertisementId);
        return ApiResponse.<String>builder()
                .result("View count updated")
                .build();
    }

    // API để tăng số lượt thích
    @PutMapping("/{id}/like")
    @Operation(summary = "Increment Likes",
            description = "Increase the like count of a main advertisement - Tăng số lượt thích của quảng cáo chính")
    public ResponseEntity<Integer> incrementLikes(@PathVariable("id") Integer advertisementId) {
        Integer totalLikes = mainAdvertisementService.incrementLikes(advertisementId);
        return ResponseEntity.ok(totalLikes);
    }

    @PutMapping("/{id}/click")
    @Operation(summary = "Increase Clicks",
            description = "Increase the click count of a main advertisement - Tăng số lượt nhấp của quảng cáo chính")
    public ResponseEntity<Integer> increaseClicks(@PathVariable("id") Integer advertisementId) {
        Integer totalClicks  = mainAdvertisementService.increaseClicks(advertisementId);
        return ResponseEntity.ok(totalClicks);
    }

    @PutMapping("/{advertisementId}/status")
    @Operation(summary = "Update Main Advertisement Status",
            description = "Update the status of a main advertisement - Cập nhật trạng thái của quảng cáo chính")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<MainAdvertisementResponse> updateMainAdvertisementStatus(
            @PathVariable("advertisementId") Integer advertisementId,
            @RequestBody AdStatusUpdateRequest request) { // Đảm bảo rằng bạn đã tạo DTO này
        return ApiResponse.<MainAdvertisementResponse>builder()
                .result(mainAdvertisementService.updateAdvertisementStatus(advertisementId, request.getNewStatus()))
                .build();
    }

    @GetMapping("/monthly-stats")
    @Operation(summary = "Get Monthly Advertisement Statistics", description = "Retrieve total active advertisements and percentage change compared to the previous month.")
    public ResponseEntity<MonthlyAdvertisementStatsResponse> getMonthlyAdvertisementStats(@RequestParam int year, @RequestParam int month) {
        MonthlyAdvertisementStatsResponse stats = mainAdvertisementService.getMonthlyAdvertisementStats(year, month);
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/save")
    @Operation(summary = "Increment Saved", description = "Increase the saved count of a main advertisement")
    public ResponseEntity<Integer> incrementSaved(@PathVariable("id") Integer advertisementId) {
        Integer totalSaved = mainAdvertisementService.incrementSaved(advertisementId);
        return ResponseEntity.ok(totalSaved);
    }

    @PutMapping("/{id}/share")
    @Operation(summary = "Increment Shared", description = "Increase the shared count of a main advertisement")
    public ResponseEntity<Integer> incrementShared(@PathVariable("id") Integer advertisementId) {
        Integer totalShared = mainAdvertisementService.incrementShared(advertisementId);
        return ResponseEntity.ok(totalShared);
    }

    @GetMapping("/active-in-all-months")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<MonthlyActiveAdvertisementStatsResponse>> getActiveAdvertisementsForAllMonths() {
        List<MonthlyActiveAdvertisementStatsResponse> activeAdsStats = mainAdvertisementService.getActiveAdvertisementsForAllMonths();

        return ApiResponse.<List<MonthlyActiveAdvertisementStatsResponse>>builder()
                .result(activeAdsStats)
                .build();
    }



}
