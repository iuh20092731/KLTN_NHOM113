package com.apartmentservices.models;

import com.apartmentservices.constant.BannerType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BannerID", nullable = false)
    Integer bannerId;

    @Column(name = "AdvertisementID")
    Integer advertisementId;

    @Column(name = "ImageURL", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci", nullable = false)
    String imageUrl;  // Đường dẫn URL của hình ảnh banner (có thể lớn hơn 255 ký tự)

    @Column(name = "LinkURL", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String linkUrl;  // Đường dẫn URL khi nhấn vào banner

    @Column(name = "Title", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String title;  // Tiêu đề của banner

    @Column(name = "Description", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String description;  // Mô tả cho banner

    @Column(name = "StartDate", nullable = false)
    LocalDateTime startDate;  // Ngày bắt đầu hiển thị banner

    @Column(name = "EndDate", nullable = false)
    LocalDateTime endDate;  // Ngày kết thúc hiển thị banner

    @Column(name = "IsActive", nullable = false)
    Boolean isActive;  // Trạng thái kích hoạt của banner

    @Enumerated(EnumType.STRING) // Định nghĩa kiểu enum
    @Column(name = "type", nullable = false)
    BannerType type; // Loại banner: "TOP", "RIGHT", "BOTTOM", "LEFT"

    @Column(name = "Seq", nullable = false)
    Integer seq;  // Số thứ tự của banner

    @Column(name = "Serial", nullable = false)
    Integer serial;  // Serial để phân biệt các banner

    @PrePersist
    public void prePersist() {
        if (this.isActive == null) {
            this.isActive = true;  // Mặc định banner là active khi tạo mới
        }
    }
}
