package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementServiceCategoryResponse {
    String categoryName;
    String categoryNameNoDiacritics;
    List<AdvertisementServiceResponse> services;
}
