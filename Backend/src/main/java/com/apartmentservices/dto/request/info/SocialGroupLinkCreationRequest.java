package com.apartmentservices.dto.request.info;

import com.apartmentservices.models.AdvertisementServiceMedia;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SocialGroupLinkCreationRequest {
    String platform;   // Tên nền tảng (Zalo, Facebook, Telegram, etc.)
    String groupName;  // Tên nhóm
    String groupLink;  // Liên kết đến nhóm
    String description; // Mô tả ngắn gọn
    String remark;     // Chú thích
    Boolean isActive;  // Trạng thái nhóm
    String imageUrl;   // URL hình ảnh
    Integer serial;    // Số thứ tự
}