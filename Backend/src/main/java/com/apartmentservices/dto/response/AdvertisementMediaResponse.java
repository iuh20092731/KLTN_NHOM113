package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementMediaResponse {

    Integer id;
    String name;
    String content;
    String url;
    String type;
//    LocalDateTime createdDate;
//    LocalDateTime updatedDate;
    Integer advertisementId;
}
