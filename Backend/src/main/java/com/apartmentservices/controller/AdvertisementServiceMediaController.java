package com.apartmentservices.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.AdvertisementServiceMediaCreationRequest;
import com.apartmentservices.dto.request.AdvertisementServiceMediaUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementServiceMediaResponse;
import com.apartmentservices.services.AdvertisementServiceMediaService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("api/v1/advertisement-service-media")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Advertisement Service Media Controller", description = "APIs for managing advertisement service media / Các API quản lý phương tiện dịch vụ quảng cáo")
public class AdvertisementServiceMediaController {

    AdvertisementServiceMediaService advertisementServiceMediaService;

    @PostMapping
    @Operation(summary = "Create Advertisement Service Media", description = "Create a new advertisement service media item / Tạo một mục phương tiện dịch vụ quảng cáo mới")
    ApiResponse<AdvertisementServiceMediaResponse> createAdvertisementServiceMedia(
            @RequestBody @Valid AdvertisementServiceMediaCreationRequest request) {
        return ApiResponse.<AdvertisementServiceMediaResponse>builder()
                .result(advertisementServiceMediaService.createAdvertisementServiceMedia(request))
                .build();
    }

    @GetMapping
    @Operation(summary = "Get All Advertisement Service Media", description = "Retrieve all advertisement service media items / Lấy tất cả các mục phương tiện dịch vụ quảng cáo")
    ApiResponse<List<AdvertisementServiceMediaResponse>> getAdvertisementServiceMedia() {
        return ApiResponse.<List<AdvertisementServiceMediaResponse>>builder()
                .result(advertisementServiceMediaService.getAllAdvertisementServiceMedia())
                .build();
    }

    @GetMapping("/{mediaId}")
    @Operation(summary = "Get Advertisement Service Media by ID", description = "Retrieve advertisement service media by its ID / Lấy phương tiện dịch vụ quảng cáo theo ID của nó")
    ApiResponse<AdvertisementServiceMediaResponse> getAdvertisementServiceMedia(
            @PathVariable("mediaId") Integer mediaId) {
        return ApiResponse.<AdvertisementServiceMediaResponse>builder()
                .result(advertisementServiceMediaService.getAdvertisementServiceMedia(mediaId))
                .build();
    }

    @DeleteMapping("/{mediaId}")
    @Operation(summary = "Delete Advertisement Service Media", description = "Delete advertisement service media by its ID / Xóa phương tiện dịch vụ quảng cáo theo ID của nó")
    ApiResponse<String> deleteAdvertisementServiceMedia(@PathVariable Integer mediaId) {
        advertisementServiceMediaService.deleteAdvertisementServiceMedia(mediaId);
        return ApiResponse.<String>builder()
                .result("Advertisement service media has been deleted")
                .build();
    }

    @PutMapping("/{mediaId}")
    @Operation(summary = "Update Advertisement Service Media", description = "Update an existing advertisement service media item by its ID / Cập nhật một mục phương tiện dịch vụ quảng cáo hiện có theo ID của nó")
    ApiResponse<AdvertisementServiceMediaResponse> updateAdvertisementServiceMedia(
            @PathVariable Integer mediaId,
            @RequestBody @Valid AdvertisementServiceMediaUpdateRequest request) {
        return ApiResponse.<AdvertisementServiceMediaResponse>builder()
                .result(advertisementServiceMediaService.updateAdvertisementServiceMedia(mediaId, request))
                .build();
    }
}
