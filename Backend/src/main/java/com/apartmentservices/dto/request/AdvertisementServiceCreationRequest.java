package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementServiceCreationRequest {

    @NotBlank(message = "SERVICE_NAME_REQUIRED")
    String serviceName;

    String description;

    Boolean deliveryAvailable;

    Boolean isActive;

    String imageUrl;

    @NotNull(message = "CATEGORY_ID_REQUIRED")
    Integer categoryId; // Thêm categoryId
}
