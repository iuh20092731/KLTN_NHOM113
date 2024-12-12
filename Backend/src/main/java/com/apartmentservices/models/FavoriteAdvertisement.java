package com.apartmentservices.models;

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
@Table(name = "FavoriteAdvertisements")
public class FavoriteAdvertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FavoriteID", nullable = false)
    Integer favoriteId;

    // Lưu ID của quảng cáo được ưa thích
    @Column(name = "AdvertisementID", nullable = false)
    Integer advertisementId;

    // Lưu ID của dịch vụ quảng cáo liên quan
    @Column(name = "ServiceID", nullable = true)
    Integer serviceId;

    // Ngày quảng cáo được thêm vào danh sách ưa thích
    @Column(name = "AddedDate", nullable = true)
    LocalDateTime addedDate;

    // Trạng thái của quảng cáo ưa thích
    @Enumerated(EnumType.STRING)
    @Column(name = "Status", nullable = true)
    FavoriteStatus status;

    // Thứ tự hiển thị
    @Column(name = "Seq", nullable = false)
    Integer seq;

    public enum FavoriteStatus {
        ACTIVE,    // Đang ưa thích
        INACTIVE   // Ngưng ưa thích
    }
}
