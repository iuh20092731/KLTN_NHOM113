package com.apartmentservices.dto.request;

import com.apartmentservices.models.FavoriteAdvertisement.FavoriteStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoriteAdvertisementRequest {

    Integer advertisementId;
    Integer serviceId;
    LocalDateTime addedDate;
    FavoriteStatus status;
}
