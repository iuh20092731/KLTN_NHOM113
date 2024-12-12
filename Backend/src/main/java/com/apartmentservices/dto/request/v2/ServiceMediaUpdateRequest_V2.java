package com.apartmentservices.dto.request.v2;

import com.apartmentservices.models.AdvertisementServiceMedia;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceMediaUpdateRequest_V2 {
    Integer mediaId; // ID của media (null nếu là media mới)

    String mediaUrl;

    AdvertisementServiceMedia.MediaType mediaType; // Loại media (IMAGE, VIDEO, BANNER)
}
