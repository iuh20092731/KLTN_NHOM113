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
public class RealEstateListingUpdateRequest {

    // Các trường có thể thay đổi mà không cần yêu cầu
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
    RealEstateType realEstateType;
    List<RealEstateMediaCreationRequest> mediaList;  // Danh sách media nếu có thay đổi
}
