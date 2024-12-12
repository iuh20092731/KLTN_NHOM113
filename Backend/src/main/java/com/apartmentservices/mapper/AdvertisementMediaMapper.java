package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.dto.response.AdvertisementMediaResponse;
import com.apartmentservices.models.AdvertisementMedia;

@Mapper(componentModel = "spring")
public interface AdvertisementMediaMapper {

    @Mapping(target = "advertisementId", source = "advertisementMedia.advertisement.advertisementId")
    AdvertisementMediaResponse toAdvertisementMediaResponse(AdvertisementMedia advertisementMedia);

    void updateAdvertisementMediaFromDto(@MappingTarget AdvertisementMedia media, AdvertisementMediaUpdateRequest request);
}
