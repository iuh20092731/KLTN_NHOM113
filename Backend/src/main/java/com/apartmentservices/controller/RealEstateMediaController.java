package com.apartmentservices.controller;

import com.apartmentservices.dto.request.RealEstateMediaCreationRequest;
import com.apartmentservices.dto.response.RealEstateMediaResponse;
import com.apartmentservices.services.RealEstateMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/real-estate-media")
@RequiredArgsConstructor
public class RealEstateMediaController {

    private final RealEstateMediaService realEstateMediaService;

    @PostMapping("/listings/{listingId}")
    public ResponseEntity<RealEstateMediaResponse> createMedia(
            @PathVariable Integer listingId,
            @RequestBody RealEstateMediaCreationRequest request) {
        RealEstateMediaResponse response = realEstateMediaService.createMedia(listingId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/listings/{listingId}")
    public ResponseEntity<List<RealEstateMediaResponse>> getAllMediaForListing(@PathVariable Integer listingId) {
        List<RealEstateMediaResponse> mediaList = realEstateMediaService.getAllMediaForListing(listingId);
        return ResponseEntity.ok(mediaList);
    }

    @GetMapping("/{mediaId}")
    public ResponseEntity<RealEstateMediaResponse> getMediaById(@PathVariable Integer mediaId) {
        RealEstateMediaResponse response = realEstateMediaService.getMediaById(mediaId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{mediaId}")
    public ResponseEntity<RealEstateMediaResponse> updateMedia(
            @PathVariable Integer mediaId,
            @RequestBody RealEstateMediaCreationRequest request) {
        RealEstateMediaResponse response = realEstateMediaService.updateMedia(mediaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Integer mediaId) {
        realEstateMediaService.deleteMedia(mediaId);
        return ResponseEntity.noContent().build();
    }
}
