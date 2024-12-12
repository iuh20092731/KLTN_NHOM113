package com.apartmentservices.mapper;

import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.dto.response.MainAdvertisementResponse;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.models.MainAdvertisement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SearchMapper {

    SearchMapper INSTANCE = Mappers.getMapper(SearchMapper.class);

    // Mapping from AdvertisementService to AdvertisementServiceResponse
//    @Mapping(target = "id", source = "serviceId")
//    @Mapping(target = "name", source = "advertisementService.serviceName")
//    @Mapping(target = "description", source = "advertisementService.description")
    @Mapping(target = "categoryId", source = "advertisementService.category.categoryId")
    @Mapping(target = "media", source = "advertisementService.advertisementMedia")
    @Mapping(target = "serviceNameNoDiacritics", source = "advertisementService.serviceNameNoDiacritics")
    @Mapping(target = "categoryNameNoDiacritics", source = "advertisementService.category.categoryNameNoDiacritics")
    AdvertisementServiceResponse toAdvertisementServiceResponse(AdvertisementService advertisementService);

    // Mapping from MainAdvertisement to MainAdvertisementResponse
//    @Mapping(target = "id", source = "mainAdvertisement.advertisementId")
//    @Mapping(target = "title", source = "mainAdvertisement.title")
//    @Mapping(target = "details", source = "mainAdvertisement.description")
    @Mapping(target = "serviceId", source = "mainAdvertisement.advertisementService.serviceId")
    @Mapping(target = "mediaList", source = "mainAdvertisement.advertisementMedia")
    @Mapping(target = "serviceName", source = "mainAdvertisement.advertisementService.serviceName")
    @Mapping(target = "serviceNameNoDiacritics", source = "mainAdvertisement.advertisementService.serviceNameNoDiacritics")
    @Mapping(target = "categoryNameNoDiacritics", source = "mainAdvertisement.advertisementService.category.categoryNameNoDiacritics")
    MainAdvertisementResponse toMainAdvertisementResponse(MainAdvertisement mainAdvertisement);
}
