package com.apartmentservices.models.info;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "SocialGroupLinks")
public class SocialGroupLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "serial")
    Integer serial; // Trường serial để phân biệt các mục con

    @Column(name = "image_url", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String imageUrl; // Trường để lưu trữ URL của hình ảnh

    @Column(name = "platform", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String platform;  // Ví dụ: Zalo, Facebook, Telegram

    @Column(name = "group_name", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String groupName; // Tên nhóm, ví dụ: "Nhóm Zalo", "Hội cư dân Hưng Ngân"

    @Column(name = "group_link", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String groupLink; // Liên kết URL của nhóm

    @Column(name = "description", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String description; // Mô tả ngắn gọn về nhóm (tuỳ chọn)

    @Column(name = "remark", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String remark; // Chú thích, thông tin bổ sung về nhóm

    @Column(name = "is_active")
    Boolean isActive; // Trạng thái của liên kết (hoạt động hay không)


}
