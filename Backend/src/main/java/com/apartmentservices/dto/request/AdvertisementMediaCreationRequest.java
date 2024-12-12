package com.apartmentservices.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import com.apartmentservices.models.AdvertisementMedia.MediaType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdvertisementMediaCreationRequest {

    String name; // Tên của phương tiện truyền thông (media)
    String content; // Nội dung (nếu có, dùng cho media kiểu TEXT hoặc thông tin bổ sung)
    String url; // Đường dẫn đến ảnh/video/banner
    MediaType type; // Loại phương tiện truyền thông (IMAGE, VIDEO, BANNER)
}
