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
public class MainAdvertisementDetailResponse {

    Integer advertisementId;
    String mainAdvertisementName;
    Integer serviceId;
    String advertiserId;
    String adminId; // Can be null

    LocalDateTime adStartDate;
    LocalDateTime adEndDate;
    Integer clicks;
    Integer views;
    Integer likes;
    String adStatus;
    String reviewNotes;
    String description;
    String detailedDescription;
    String address;
    String phoneNumber;
    BigDecimal priceRangeLow;
    BigDecimal priceRangeHigh;
    LocalTime openingHourStart;
    LocalTime openingHourEnd;
    String googleMapLink;
    String websiteLink;
    String zaloLink;
    String facebookLink;
    Boolean deliveryAvailable;

    Integer reviewCount;
    BigDecimal averageRating;

    String categoryName;
    String categoryNameNoDiacritics;

    List<AdvertisementMediaResponse> mediaList;
}
