package com.apartmentservices.services;

import com.apartmentservices.constant.RealEstateType;
import com.apartmentservices.dto.request.RealEstateMediaCreationRequest;
import com.apartmentservices.dto.response.RealEstateListingResponse;
import com.apartmentservices.dto.response.RealEstateMediaResponse;
import com.apartmentservices.models.RealEstateMedia;

import java.util.List;

public interface RealEstateMediaService {
    RealEstateMediaResponse createMedia(Integer listingId, RealEstateMediaCreationRequest request);
    List<RealEstateMediaResponse> getAllMediaForListing(Integer listingId);
    RealEstateMediaResponse getMediaById(Integer mediaId);
    RealEstateMediaResponse updateMedia(Integer mediaId, RealEstateMediaCreationRequest request);
    void deleteMedia(Integer mediaId);

    List<RealEstateMediaResponse> getMediaForListing(Integer listingId);

    RealEstateMedia createMediaForListing(Integer listingId, RealEstateMediaCreationRequest mediaRequest);


}
