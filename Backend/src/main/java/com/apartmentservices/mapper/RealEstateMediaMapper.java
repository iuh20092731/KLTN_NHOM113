package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.RealEstateMediaCreationRequest;
import com.apartmentservices.dto.response.RealEstateMediaResponse;
import com.apartmentservices.models.RealEstateMedia;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RealEstateMediaMapper {

    RealEstateMedia toRealEstateMedia(RealEstateMediaCreationRequest request);

    RealEstateMediaResponse toRealEstateMediaResponse(RealEstateMedia media);
}
