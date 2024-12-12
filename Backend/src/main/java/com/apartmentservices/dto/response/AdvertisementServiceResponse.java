package com.apartmentservices.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementServiceResponse {

    Integer serviceId;
    String serviceName;
    String description;
    Boolean deliveryAvailable;
    Integer categoryId;
    String serviceNameNoDiacritics;
    String categoryName;
    String categoryNameNoDiacritics;
    Boolean isActive;
    List<AdvertisementServiceMediaResponse> media;
}
