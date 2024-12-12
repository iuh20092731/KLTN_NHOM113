package com.apartmentservices.dto.request;

import com.apartmentservices.models.AdvertisementMedia;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementMediaUpdateRequest_V2 {
    Integer id; // Nếu null, media này là mới
    String name;
    String content;
    String url;
    AdvertisementMedia.MediaType type; // Enum IMAGE, VIDEO, BANNER
}
