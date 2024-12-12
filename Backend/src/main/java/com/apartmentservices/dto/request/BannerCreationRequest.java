package com.apartmentservices.dto.request;

import com.apartmentservices.constant.BannerType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BannerCreationRequest {
    String imageUrl;           // Có thể null
    String linkUrl;            // Có thể null
    String title;              // Có thể null
    String description;        // Có thể null
    BannerType type;           // Không thể null
    Integer seq;               // Có thể null
    Integer advertisementId;   // Có thể null
}
