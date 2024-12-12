package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResponse {
    Integer serviceId;
    String serviceName;
    String description;
    Boolean deliveryAvailable;
    Integer subcategoryId;
}