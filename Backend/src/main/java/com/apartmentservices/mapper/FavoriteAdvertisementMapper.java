package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.FavoriteAdvertisementRequest;
import com.apartmentservices.dto.response.FavoriteAdvertisementResponse;
import com.apartmentservices.models.FavoriteAdvertisement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FavoriteAdvertisementMapper {

    FavoriteAdvertisement toFavoriteAdvertisement(FavoriteAdvertisementRequest request);

    FavoriteAdvertisementResponse toFavoriteAdvertisementResponse(FavoriteAdvertisement favoriteAdvertisement);

    @Mapping(target = "advertisementId", source = "advertisementId")
    @Mapping(target = "serviceId", source = "serviceId")
    void updateFavoriteAdvertisement(@MappingTarget FavoriteAdvertisement favoriteAdvertisement, FavoriteAdvertisementRequest request);
}
