package com.apartmentservices.dto.response;

import com.apartmentservices.models.FavoriteAdvertisement.FavoriteStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FavoriteAdvertisementResponse {

    Integer favoriteId;
    Integer advertisementId;
    Integer serviceId;
    Integer seq;
    LocalDateTime addedDate;
    FavoriteStatus status;
}
