package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MainAdvertisementUpdateRequest {

    String mainAdvertisementName;

    LocalDateTime adStartDate;
    LocalDateTime adEndDate;

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
}
