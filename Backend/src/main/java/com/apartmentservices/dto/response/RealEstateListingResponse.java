package com.apartmentservices.dto.response;

import com.apartmentservices.constant.RealEstateType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstateListingResponse {


    Integer listingId;
    String title;
    Double price;
    Double area;
    Double pricePerSquareMeter;
    Integer bedrooms;
    Integer bathrooms;
    String address;
    String detailedAddress;
    String description;
    String contactPhoneNumber;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    RealEstateType realEstateType;

    UserResponse user;

    List<RealEstateMediaResponse> mediaList;
}
