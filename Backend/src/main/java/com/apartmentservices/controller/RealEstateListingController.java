package com.apartmentservices.controller;

import com.apartmentservices.constant.RealEstateType;
import com.apartmentservices.dto.request.RealEstateListingCreationRequest;
import com.apartmentservices.dto.request.RealEstateListingUpdateRequest;
import com.apartmentservices.dto.response.RealEstateListingResponse;
import com.apartmentservices.services.RealEstateListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/real-estate-listings")
@RequiredArgsConstructor
public class RealEstateListingController {

    private final RealEstateListingService realEstateListingService;


    @PostMapping
    public ResponseEntity<RealEstateListingResponse> createListing(@RequestBody RealEstateListingCreationRequest request) {
        RealEstateListingResponse response = realEstateListingService.createListing(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RealEstateListingResponse>> getAllListings() {
        List<RealEstateListingResponse> listings = realEstateListingService.getAllListings();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{listingId}")
    public ResponseEntity<RealEstateListingResponse> getListingById(@PathVariable Integer listingId) {
        RealEstateListingResponse response = realEstateListingService.getListingById(listingId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{listingId}")
    public ResponseEntity<RealEstateListingResponse> updateListing(
            @PathVariable Integer listingId,
            @RequestBody RealEstateListingUpdateRequest request) {
        RealEstateListingResponse response = realEstateListingService.updateListing(listingId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> deleteListing(@PathVariable Integer listingId) {
        realEstateListingService.deleteListing(listingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<RealEstateListingResponse>> getListingsByType(
            @RequestParam RealEstateType realEstateType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<RealEstateListingResponse> listings = realEstateListingService.getListingsByType(realEstateType, page, size);
        return ResponseEntity.ok(listings);
    }

}
