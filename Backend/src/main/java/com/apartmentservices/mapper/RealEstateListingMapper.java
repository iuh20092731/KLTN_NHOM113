package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.RealEstateListingCreationRequest;
import com.apartmentservices.dto.response.RealEstateListingResponse;
import com.apartmentservices.models.RealEstateListing;
import com.apartmentservices.models.RealEstateMedia;
import com.apartmentservices.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RealEstateListingMapper {

    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "realEstateType", source = "request.realEstateType")
    @Mapping(target = "title", source = "request.title")
    @Mapping(target = "price", source = "request.price")
    @Mapping(target = "area", source = "request.area")
    @Mapping(target = "pricePerSquareMeter", source = "request.pricePerSquareMeter")
    @Mapping(target = "bedrooms", source = "request.bedrooms")
    @Mapping(target = "bathrooms", source = "request.bathrooms")
    @Mapping(target = "address", source = "request.address")
    @Mapping(target = "detailedAddress", source = "request.detailedAddress")
    @Mapping(target = "description", source = "request.description")
    @Mapping(target = "contactPhoneNumber", source = "request.contactPhoneNumber")
    @Mapping(target = "user", source = "user") // Dùng user đã lấy từ service
    RealEstateListing toRealEstateListing(RealEstateListingCreationRequest request, User user);

    @Mapping(target = "realEstateType", source = "listing.realEstateType")
    @Mapping(target = "updatedAt", source = "listing.updatedAt")
    @Mapping(target = "user", source = "listing.user")
    RealEstateListingResponse toRealEstateListingResponse(RealEstateListing listing);

    @Mapping(target = "realEstateType", source = "listing.realEstateType")
    @Mapping(target = "updatedAt", source = "listing.updatedAt")
    @Mapping(target = "user", source = "listing.user")
    @Mapping(target = "mediaList", source = "mediaEntities")
    RealEstateListingResponse toRealEstateListingResponse2(RealEstateListing listing, List<RealEstateMedia> mediaEntities);
}
