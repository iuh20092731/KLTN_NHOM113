package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    Integer categoryId;
    Integer categorySeq;
    String categoryName;
    String imageLink;
    String categoryNameNoDiacritics;
    Boolean isActive;

    LocalDateTime createdDate;
    LocalDateTime updatedDate;

    String remark;

    List<AdvertisementServiceResponse> advertisementServices;
}
