package com.apartmentservices.dto.request;

import com.apartmentservices.models.MainAdvertisement;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdStatusUpdateRequest {
    @NotNull(message = "New status must not be null")
    MainAdvertisement.AdStatus newStatus;
}