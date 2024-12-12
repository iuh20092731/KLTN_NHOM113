package com.apartmentservices.controller;

import com.apartmentservices.dto.request.AdvertisementMediaUpdateReq;
import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementMediaResponse;
import com.apartmentservices.models.AdvertisementMedia;
import com.apartmentservices.services.AdvertisementMediaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/advertisement-media")
@Tag(name = "Advertisement Media Controller", description = "APIs for managing advertisement media / Các API quản lý phương tiện quảng cáo")
public class AdvertisementMediaController {

    AdvertisementMediaService advertisementMediaService;

    // Create
    @Operation(summary = "Create Media", description = "Create a new media item for advertisement / Tạo một mục phương tiện mới cho quảng cáo")
    @PostMapping
    public ResponseEntity<AdvertisementMedia> createMedia(@RequestBody AdvertisementMedia media) {
        AdvertisementMedia createdMedia = advertisementMediaService.createMedia(media);
        return ResponseEntity.ok(createdMedia);
    }

    // Read (Get all media by advertisement ID)
    @Operation(summary = "Get Media by Advertisement ID", description = "Get all media items associated with a specific advertisement ID / Lấy tất cả các mục phương tiện liên kết với một ID quảng cáo cụ thể")
    @GetMapping("/advertisement/{advertisementId}")
    public ResponseEntity<List<AdvertisementMedia>> getMediaByAdvertisement(@PathVariable Integer advertisementId) {
        List<AdvertisementMedia> mediaList = advertisementMediaService.getAllMediaByAdvertisement(advertisementId);
        return ResponseEntity.ok(mediaList);
    }

    // Read (Get media by advertisement ID and type)
    @Operation(summary = "Get Media by Advertisement ID and Type", description = "Get media items associated with a specific advertisement ID and type / Lấy các mục phương tiện liên kết với một ID quảng cáo và loại cụ thể")
    @GetMapping("/advertisement/{advertisementId}/type/{type}")
    public ResponseEntity<List<AdvertisementMedia>> getMediaByAdvertisementAndType(
            @PathVariable Integer advertisementId,
            @PathVariable AdvertisementMedia.MediaType type) {
        List<AdvertisementMedia> mediaList = advertisementMediaService.getMediaByAdvertisementAndType(advertisementId, type);
        return ResponseEntity.ok(mediaList);
    }


//    @PutMapping("/advertisement/{advertisementId}")
//    public ResponseEntity<AdvertisementMedia> updateMediaByAdvertisementId(
//            @PathVariable Integer advertisementId,
//            @RequestBody AdvertisementMediaUpdateRequest updatedMediaRequest) {
//
//        AdvertisementMedia updatedMedia = advertisementMediaService.updateMediaByAdvertisementId(advertisementId, updatedMediaRequest);
//
//        if (updatedMedia != null) {
//            return ResponseEntity.ok(updatedMedia);
//        } else {
//            return ResponseEntity.notFound().build(); // Không tìm thấy media cho advertisementId
//        }
//    }

    // Update
    @Operation(summary = "Update Media", description = "Update an existing media item by its ID / Cập nhật một mục phương tiện hiện có theo ID của nó")
    @PutMapping("/{mediaId}")
    public ResponseEntity<AdvertisementMediaResponse> updateMedia(
            @PathVariable Integer mediaId,
            @RequestBody AdvertisementMediaUpdateReq updatedMedia) {
        AdvertisementMediaResponse media = advertisementMediaService.updateMedia(mediaId, updatedMedia);
        if (media != null) {
            return ResponseEntity.ok(media);
        }
        return ResponseEntity.notFound().build(); // or return an appropriate error response
    }

    // Delete
    @Operation(summary = "Delete Media", description = "Delete a media item by its ID / Xóa một mục phương tiện theo ID của nó")
    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Integer mediaId) {
        advertisementMediaService.deleteMedia(mediaId);
        return ResponseEntity.noContent().build();
    }

    // Get Top 5 Banners
    @Operation(summary = "Get Top 5 Banners", description = "Retrieve the top 5 banners / Lấy 5 banner hàng đầu")
    @GetMapping("/banners")
    public ResponseEntity<List<AdvertisementMediaResponse>> getTop5Banners() {
        List<AdvertisementMediaResponse> banners = advertisementMediaService.getTop5Banners();
        return ResponseEntity.ok(banners);
    }
}
