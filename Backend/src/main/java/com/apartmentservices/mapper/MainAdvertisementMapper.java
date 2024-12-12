package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.*;
import com.apartmentservices.dto.response.*;
import com.apartmentservices.models.AdvertisementMedia;
import com.apartmentservices.models.AdvertisementService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.models.MainAdvertisement;

import java.util.Objects;

@Mapper(componentModel = "spring")
public interface MainAdvertisementMapper {

    @Mapping(target = "advertisementService.serviceId", source = "serviceId")
    @Mapping(target = "advertiser.userId", source = "advertiserId")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "deliveryAvailable", source = "deliveryAvailable")
    @Mapping(target = "detailedDescription", source = "detailedDescription")
    @Mapping(target = "admin.userId", source = "adminId")
    MainAdvertisement toMainAdvertisement(MainAdvertisementCreationRequest request);


    @Mapping(target = "serviceId", source = "advertisementService.serviceId")
    @Mapping(target = "serviceName", source = "advertisementService.serviceName")
    @Mapping(target = "serviceNameNoDiacritics", source = "advertisementService.serviceNameNoDiacritics")
    @Mapping(target = "categoryNameNoDiacritics", source = "advertisementService.category.categoryNameNoDiacritics")
    @Mapping(target = "categoryId", source = "advertisementService.category.categoryId")
    @Mapping(target = "advertiserId", source = "advertiser.userId")
    @Mapping(target = "adminId", source = "admin.userId")
    @Mapping(target = "adStatus", source = "adStatus")
    @Mapping(target = "clicks", source = "clicks")
    @Mapping(target = "views", source = "views")
    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
    @Mapping(target = "websiteLink", source = "websiteLink")
    @Mapping(target = "mediaList", source = "advertisementMedia")
    @Mapping(target = "deliveryAvailable", source = "deliveryAvailable")
    @Mapping(target = "zaloLink", source = "zaloLink")
    @Mapping(target = "facebookLink", source = "facebookLink")
    @Mapping(target = "categoryName", source = "advertisementService.category.categoryName")
    @Mapping(target = "createTime", source = "createTime")
    MainAdvertisementResponse toMainAdvertisementResponse(MainAdvertisement advertisement);

    @Mapping(target = "serviceId", source = "advertisementService.serviceId")
    @Mapping(target = "views", source = "views")
    @Mapping(target = "likes", source = "likes")
    @Mapping(target = "saves", source = "saved")
    @Mapping(target = "shares", source = "shared")
    @Mapping(target = "clicks", source = "clicks")
    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
    @Mapping(target = "mediaList", source = "advertisementMedia")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "distance", source = "distance")
    @Mapping(target = "zaloLink", source = "zaloLink")
    @Mapping(target = "facebookLink", source = "facebookLink")
    @Mapping(target = "categoryName", source = "advertisementService.category.categoryName")
    @Mapping(target = "categoryNameNoDiacritics", source = "advertisementService.category.categoryNameNoDiacritics")
    @Mapping(target = "serviceName", source = "advertisementService.serviceName")
    @Mapping(target = "serviceNameNoDiacritics", source = "advertisementService.serviceNameNoDiacritics")
//    @Mapping(target = "averageRating", source = "averageRating")
//    @Mapping(target = "reviewCount", source = "reviewCount")
    MainAdvertisementMiniResponse toMainAdvertisementMiniResponse(MainAdvertisement advertisement);

    @Mapping(target = "serviceId", source = "advertisementService.serviceId")
    @Mapping(target = "serviceName", source = "advertisementService.serviceName")
    @Mapping(target = "serviceNameNoDiacritics", source = "advertisementService.serviceNameNoDiacritics")
    @Mapping(target = "advertiserId", source = "advertiser.userId")
    @Mapping(target = "adminId", source = "admin.userId")
    @Mapping(target = "adStatus", source = "adStatus")
    @Mapping(target = "clicks", source = "clicks")
    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
    @Mapping(target = "websiteLink", source = "websiteLink")
    @Mapping(target = "mediaList", source = "advertisementMedia")
    @Mapping(target = "zaloLink", source = "zaloLink")
    @Mapping(target = "facebookLink", source = "facebookLink")
    MainAdvertisementTopResponse toMainAdvertisementTopResponse(MainAdvertisement advertisement);

    @Mapping(target = "serviceId", source = "advertisementService.serviceId")
    @Mapping(target = "advertiserId", source = "advertiser.userId")
    @Mapping(target = "adminId", source = "admin.userId")
    @Mapping(target = "adStatus", source = "adStatus")
    @Mapping(target = "clicks", source = "clicks")
    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
    @Mapping(target = "websiteLink", source = "websiteLink")
    @Mapping(target = "mediaList", source = "advertisementMedia")
    @Mapping(target = "zaloLink", source = "zaloLink")
    @Mapping(target = "facebookLink", source = "facebookLink")
    MainAdvertisementResponse_V2 toMainAdvertisementResponse_V2(MainAdvertisement advertisement);

    @Mapping(target = "serviceId", source = "advertisementService.serviceId")
    @Mapping(target = "advertiserId", source = "advertiser.userId")
    @Mapping(target = "adminId", source = "admin.userId")
    @Mapping(target = "adStatus", source = "adStatus")
    @Mapping(target = "clicks", source = "clicks")
    @Mapping(target = "likes", source = "likes")
    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
    @Mapping(target = "websiteLink", source = "websiteLink")
    @Mapping(target = "mediaList", source = "advertisementMedia")
    @Mapping(target = "zaloLink", source = "zaloLink")
    @Mapping(target = "facebookLink", source = "facebookLink")
    @Mapping(target = "categoryName", source = "advertisementService.category.categoryName")
    @Mapping(target = "categoryNameNoDiacritics", source = "advertisementService.category.categoryNameNoDiacritics")
    MainAdvertisementDetailResponse toMainAdvertisementDetailResponse(MainAdvertisement advertisement);


//    @Mapping(target = "advertisementService", ignore = true)
//    @Mapping(target = "advertiser", ignore = true)
//    @Mapping(target = "admin", ignore = true)
//    @Mapping(target = "mainAdvertisementName", source = "mainAdvertisementName")
//    @Mapping(target = "adStartDate", source = "adStartDate")
//    @Mapping(target = "adEndDate", source = "adEndDate")
//    @Mapping(target = "description", source = "description")
//    @Mapping(target = "detailedDescription", source = "detailedDescription")
//    @Mapping(target = "address", source = "address")
//    @Mapping(target = "phoneNumber", source = "phoneNumber")
//    @Mapping(target = "priceRangeLow", source = "priceRangeLow")
//    @Mapping(target = "priceRangeHigh", source = "priceRangeHigh")
//    @Mapping(target = "openingHourStart", source = "openingHourStart")
//    @Mapping(target = "openingHourEnd", source = "openingHourEnd")
//    @Mapping(target = "googleMapLink", source = "googleMapLink")
//    @Mapping(target = "websiteLink", source = "websiteLink")
//    @Mapping(target = "zaloLink", source = "zaloLink")
//    @Mapping(target = "facebookLink", source = "facebookLink")
//    @Mapping(target = "deliveryAvailable", source = "deliveryAvailable")
//    void updateMainAdvertisement(@MappingTarget MainAdvertisement advertisement, MainAdvertisementUpdateRequest request);

    @Mapping(target = "advertisementService", ignore = true)
    @Mapping(target = "advertiser", ignore = true)
    @Mapping(target = "admin", ignore = true)
    default void updateMainAdvertisement(@MappingTarget MainAdvertisement advertisement, MainAdvertisementUpdateRequest request) {
        if (request.getMainAdvertisementName() != null) {
            advertisement.setMainAdvertisementName(request.getMainAdvertisementName());
        }
        if (request.getAdStartDate() != null) {
            advertisement.setAdStartDate(request.getAdStartDate());
        }
        if (request.getAdEndDate() != null) {
            advertisement.setAdEndDate(request.getAdEndDate());
        }
        if (request.getDescription() != null) {
            advertisement.setDescription(request.getDescription());
        }
        if (request.getDetailedDescription() != null) {
            advertisement.setDetailedDescription(request.getDetailedDescription());
        }
        if (request.getAddress() != null) {
            advertisement.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            advertisement.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getPriceRangeLow() != null) {
            advertisement.setPriceRangeLow(request.getPriceRangeLow());
        }
        if (request.getPriceRangeHigh() != null) {
            advertisement.setPriceRangeHigh(request.getPriceRangeHigh());
        }
        if (request.getOpeningHourStart() != null) {
            advertisement.setOpeningHourStart(request.getOpeningHourStart());
        }
        if (request.getOpeningHourEnd() != null) {
            advertisement.setOpeningHourEnd(request.getOpeningHourEnd());
        }
        if (request.getGoogleMapLink() != null) {
            advertisement.setGoogleMapLink(request.getGoogleMapLink());
        }
        if (request.getWebsiteLink() != null) {
            advertisement.setWebsiteLink(request.getWebsiteLink());
        }
        if (request.getZaloLink() != null) {
            advertisement.setZaloLink(request.getZaloLink());
        }
        if (request.getFacebookLink() != null) {
            advertisement.setFacebookLink(request.getFacebookLink());
        }
        if (request.getDeliveryAvailable() != null) {
            advertisement.setDeliveryAvailable(request.getDeliveryAvailable());
        }
    }

    @Mapping(target = "advertisementService", ignore = true)
    @Mapping(target = "advertiser", ignore = true)
    @Mapping(target = "admin", ignore = true)
    default void updateMainAdvertisement_V2(@MappingTarget MainAdvertisement advertisement, MainAdvertisementUpdateRequest_V2 request) {
        // Cập nhật các trường khác như bình thường
        if (request.getMainAdvertisementName() != null) {
            advertisement.setMainAdvertisementName(request.getMainAdvertisementName());
        }
        if (request.getAdStartDate() != null) {
            advertisement.setAdStartDate(request.getAdStartDate());
        }
        if (request.getAdEndDate() != null) {
            advertisement.setAdEndDate(request.getAdEndDate());
        }
        if (request.getDescription() != null) {
            advertisement.setDescription(request.getDescription());
        }
        if (request.getDetailedDescription() != null) {
            advertisement.setDetailedDescription(request.getDetailedDescription());
        }
        if (request.getAddress() != null) {
            advertisement.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            advertisement.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getPriceRangeLow() != null) {
            advertisement.setPriceRangeLow(request.getPriceRangeLow());
        }
        if (request.getPriceRangeHigh() != null) {
            advertisement.setPriceRangeHigh(request.getPriceRangeHigh());
        }
        if (request.getOpeningHourStart() != null) {
            advertisement.setOpeningHourStart(request.getOpeningHourStart());
        }
        if (request.getOpeningHourEnd() != null) {
            advertisement.setOpeningHourEnd(request.getOpeningHourEnd());
        }
        if (request.getGoogleMapLink() != null) {
            advertisement.setGoogleMapLink(request.getGoogleMapLink());
        }
        if (request.getWebsiteLink() != null) {
            advertisement.setWebsiteLink(request.getWebsiteLink());
        }
        if (request.getZaloLink() != null) {
            advertisement.setZaloLink(request.getZaloLink());
        }
        if (request.getFacebookLink() != null) {
            advertisement.setFacebookLink(request.getFacebookLink());
        }
        if (request.getDeliveryAvailable() != null) {
            advertisement.setDeliveryAvailable(request.getDeliveryAvailable());
        }

        // Cập nhật danh sách AdvertisementMedia
        if (request.getAdvertisementMedia() != null) {
            // Loại bỏ các media hiện tại không tồn tại trong request
            advertisement.getAdvertisementMedia().removeIf(existingMedia ->
                    request.getAdvertisementMedia().stream().noneMatch(newMedia ->
                            Objects.equals(newMedia.getId(), existingMedia.getId())
                    )
            );
        }
    }


    AdvertisementMedia toAdvertisementMedia(AdvertisementMediaUpdateRequest_V2 request);

    void updateAdvertisementMedia(@MappingTarget AdvertisementMedia media, AdvertisementMediaUpdateRequest_V2 request);
}