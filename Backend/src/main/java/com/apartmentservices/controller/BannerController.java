package com.apartmentservices.controller;

import com.apartmentservices.constant.BannerType;
import com.apartmentservices.dto.request.BannerCreationRequest;
import com.apartmentservices.dto.request.BannerUpdateRequest;
import com.apartmentservices.dto.response.BannerResponse;
import com.apartmentservices.models.Banner;
import com.apartmentservices.services.BannerService;
import com.apartmentservices.success.ApiSuccessResponse;
import com.apartmentservices.success.GlobalResponseHandler;
import com.apartmentservices.success.SuccessCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
@Tag(name = "Banner Controller", description = "APIs for managing banners / Các API để quản lý banner")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BannerController {

    BannerService bannerService;
    GlobalResponseHandler responseHandler;


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create Banner", description = "Create a new banner / Tạo một banner mới")
    public ResponseEntity<BannerResponse> createBanner(@RequestBody BannerCreationRequest request) {
        BannerResponse response = bannerService.createBanner_V2(request, true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{bannerId}")
    @Operation(summary = "Get Banner", description = "Get a banner by its ID / Lấy banner theo ID")
    public ResponseEntity<BannerResponse> getBanner(@PathVariable("bannerId") Integer bannerId) {
        BannerResponse response = bannerService.getBannerById(bannerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get All Banners", description = "Retrieve a list of all banners / Lấy danh sách tất cả các banner")
    public ResponseEntity<List<BannerResponse>> getAllBanners() {
        List<BannerResponse> responses = bannerService.getAllBanners();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get Banners by Type", description = "Retrieve banners by type / Lấy banner theo loại")
    public ResponseEntity<List<BannerResponse>> getBannersByType(@PathVariable String type) {
        // Chuyển đổi String thành BannerType
        BannerType bannerType;
        try {
            bannerType = BannerType.valueOf(type.toUpperCase()); // Chuyển đổi thành chữ hoa để so sánh
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList()); // Trả về lỗi nếu không tìm thấy enum
        }

        List<BannerResponse> responses = bannerService.getBannersByType(bannerType);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/type/{type}/seq/{seq}")
    @Operation(summary = "Get Banners by Type and Seq", description = "Retrieve banners by type and seq / Lấy banner theo loại và seq")
    public ResponseEntity<List<BannerResponse>> getBannersByTypeAndSeq(@PathVariable String type, @PathVariable int seq) {
        BannerType bannerType;
        try {
            bannerType = BannerType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<BannerResponse> responses = bannerService.getBannersByTypeAndSeq(bannerType, seq);
        return ResponseEntity.ok(responses);
    }



    @PutMapping("/{bannerId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Banner", description = "Update a banner by its ID / Cập nhật một banner theo ID")
    public ResponseEntity<BannerResponse> updateBanner(@PathVariable("bannerId") Integer bannerId, @RequestBody BannerUpdateRequest request) {
        BannerResponse response = bannerService.updateBanner(bannerId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{bannerId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Banner", description = "Delete a banner by its ID / Xóa một banner theo ID")
    public ResponseEntity<ApiSuccessResponse> deleteBanner(@PathVariable("bannerId") Integer bannerId) {
        bannerService.deleteBanner(bannerId);
        ApiSuccessResponse successResponse = ApiSuccessResponse.builder()
                .code(SuccessCode.BANNER_DELETED.getCode())
                .message(SuccessCode.BANNER_DELETED.getMessage())
                .build();
        return new ResponseEntity<>(successResponse, SuccessCode.BANNER_UPDATED.getStatus());
    }


    @PatchMapping("/{bannerId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Banner Status", description = "Cập nhật trạng thái isActive của banner")
    public ResponseEntity<ApiSuccessResponse> updateBannerStatus(@PathVariable Integer bannerId, @RequestParam Boolean isActive) {
        bannerService.updateBannerStatus(bannerId, isActive);
        // Gọi GlobalResponseHandler để tạo phản hồi thành công
        return responseHandler.buildSuccessResponse(SuccessCode.BANNER_UPDATED);
    }

    @PutMapping("/update")
    @Operation(summary = "Update Banners", description = "Update multiple banners")
    public ResponseEntity<?> updateBanners(@RequestBody List<Banner> banners) {
        bannerService.updateBanners(banners);
        return responseHandler.buildSuccessResponse(SuccessCode.BANNER_UPDATED);
    }

    @GetMapping("/all-right-banners")
    public ResponseEntity<List<BannerResponse>> getAllRightBanners() {
        List<BannerResponse> banners = bannerService.getAllRightBannersWithMaxSerial();
        return ResponseEntity.ok(banners);
    }
}
