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
public class ServiceCreationRequest {

    @NotBlank(message = "SERVICE_NAME_REQUIRED")
    String serviceName;

    String description;

    @NotNull(message = "SUBCATEGORY_ID_REQUIRED")
    Integer subcategoryId;

    @NotNull(message = "DELIVERY_AVAILABLE_REQUIRED")
    Boolean deliveryAvailable;
}
