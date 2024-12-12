package com.apartmentservices.controller;

import com.apartmentservices.dto.request.ApiResponse;
import com.apartmentservices.dto.request.FavoriteAdvertisementRequest;
import com.apartmentservices.dto.response.FavoriteAdvertisementResponse;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.models.FavoriteAdvertisement;
import com.apartmentservices.services.FavoriteAdvertisementService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/favorite-advertisements")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteAdvertisementController {

    FavoriteAdvertisementService favoriteAdvertisementService;

//    @GetMapping("/all")
//    @Operation(summary = "Get All Advertisements by Favorite Advertisements",
//            description = "Get all advertisements based on favorite advertisements with paging")
//    public ApiResponse<List<MainAdvertisementResponse>> getAllAdvertisementsByFavorites(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//
//        List<MainAdvertisementResponse> advertisements = favoriteAdvertisementService.getAllAdvertisementsByFavorites(page, size);
//        return ApiResponse.<List<MainAdvertisementResponse>>builder()
//                .result(advertisements)
//                .build();
//    }

    @GetMapping("/all")
    @Operation(summary = "Get All Advertisements by Favorite Advertisements",
            description = "Get all advertisements based on favorite advertisements with paging")
    public ApiResponse<Page<MainAdvertisementResponse>> getAllAdvertisementsByFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<MainAdvertisementResponse> advertisements = favoriteAdvertisementService.getAllAdvertisementsByFavorites(page, size);
        return ApiResponse.<Page<MainAdvertisementResponse>>builder()
                .result(advertisements)
                .build();
    }

    @PostMapping
    public ApiResponse<FavoriteAdvertisementResponse> createFavoriteAdvertisement(
            @RequestBody @Valid FavoriteAdvertisementRequest request) {
        FavoriteAdvertisementResponse response = favoriteAdvertisementService.createFavoriteAdvertisement(request);
        return ApiResponse.<FavoriteAdvertisementResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/{favoriteId}")
    public ApiResponse<FavoriteAdvertisementResponse> getFavoriteAdvertisement(@PathVariable Integer favoriteId) {
        FavoriteAdvertisementResponse response = favoriteAdvertisementService.getFavoriteAdvertisementById(favoriteId);
        return ApiResponse.<FavoriteAdvertisementResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<List<FavoriteAdvertisementResponse>> getAllFavoriteAdvertisements() {
        List<FavoriteAdvertisementResponse> responseList = favoriteAdvertisementService.getAllFavoriteAdvertisements();
        return ApiResponse.<List<FavoriteAdvertisementResponse>>builder()
                .result(responseList)
                .build();
    }

    @PutMapping("/{favoriteId}")
    public ApiResponse<FavoriteAdvertisementResponse> updateFavoriteAdvertisement(
            @PathVariable Integer favoriteId,
            @RequestBody @Valid FavoriteAdvertisementRequest request) {
        FavoriteAdvertisementResponse response = favoriteAdvertisementService.updateFavoriteAdvertisement(favoriteId, request);
        return ApiResponse.<FavoriteAdvertisementResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/{favoriteId}")
    public ApiResponse<Void> deleteFavoriteAdvertisement(@PathVariable Integer favoriteId) {
        favoriteAdvertisementService.deleteFavoriteAdvertisement(favoriteId);
        return ApiResponse.<Void>builder()
                .build();
    }
    @DeleteMapping("/advertisement/{advertisementId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete Favorite Advertisement by Advertisement ID",
            description = "Deletes a favorite advertisement based on the advertisement ID")
    public ApiResponse<Void> deleteFavoriteAdvertisementByAdvertisementId(@PathVariable Integer advertisementId) {
        favoriteAdvertisementService.deleteFavoriteAdvertisementByAdvertisementId(advertisementId);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PatchMapping("/{favoriteId}/status")
    @Operation(summary = "Update Favorite Advertisement Status",
            description = "Updates the status of a favorite advertisement by its ID")
    public ApiResponse<FavoriteAdvertisementResponse> updateFavoriteStatus(
            @PathVariable Integer favoriteId,
            @RequestParam FavoriteAdvertisement.FavoriteStatus status) {
        FavoriteAdvertisementResponse updatedFavorite = favoriteAdvertisementService.updateFavoriteStatus(favoriteId, status);
        return ApiResponse.<FavoriteAdvertisementResponse>builder()
                .result(updatedFavorite)
                .build();
    }


}
