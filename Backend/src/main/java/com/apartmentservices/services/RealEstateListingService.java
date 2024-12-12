package com.apartmentservices.services;

import com.apartmentservices.constant.RealEstateType;
import com.apartmentservices.dto.request.RealEstateListingCreationRequest;
import com.apartmentservices.dto.request.RealEstateListingUpdateRequest;
import com.apartmentservices.dto.response.RealEstateListingResponse;

import java.util.List;

public interface RealEstateListingService {
    RealEstateListingResponse createListing(RealEstateListingCreationRequest request);
    List<RealEstateListingResponse> getAllListings();
    RealEstateListingResponse getListingById(Integer listingId);
    RealEstateListingResponse updateListing(Integer listingId, RealEstateListingUpdateRequest request);
    void deleteListing(Integer listingId);

    List<RealEstateListingResponse> getListingsByType(RealEstateType realEstateType, int page, int size);
}
