package com.apartmentservices.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MainAdvertisementMiniResponse {

    Integer advertisementId;
    String mainAdvertisementName;
    Integer serviceId;

    String description;
    String detailedDescription;
    String address;
    Boolean deliveryAvailable;
    String phoneNumber;

    Integer clicks;
    Integer views;
    Integer likes;
    Integer saves;
    Integer shares;
    Double distance;
    BigDecimal averageRating;
    Integer reviewCount;
    String zaloLink;
    String facebookLink;

    String categoryName;
    String categoryNameNoDiacritics;
    String serviceName;
    String serviceNameNoDiacritics;

    List<AdvertisementMediaResponse> mediaList;
}
