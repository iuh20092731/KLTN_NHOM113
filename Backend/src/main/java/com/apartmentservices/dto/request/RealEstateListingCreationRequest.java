package com.apartmentservices.dto.request;

import com.apartmentservices.constant.RealEstateType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstateListingCreationRequest {

    @NotNull(message = "USER_ID_REQUIRED")
    String userId;  // Add this field to pass the User's ID

    @NotBlank(message = "TITLE_REQUIRED")
    String title;

    @NotNull(message = "PRICE_REQUIRED")
    Double price;

    @NotNull(message = "AREA_REQUIRED")
    Double area;

    @NotNull(message = "PRICE_PER_SQUARE_METER_REQUIRED")
    Double pricePerSquareMeter;

    Integer bedrooms;
    Integer bathrooms;

    @NotBlank(message = "ADDRESS_REQUIRED")
    String address;

    @NotBlank(message = "DETAILED_ADDRESS_REQUIRED")
    String detailedAddress;

    String description;
    String contactPhoneNumber;

    RealEstateType realEstateType;

    List<RealEstateMediaCreationRequest> mediaList;
}
