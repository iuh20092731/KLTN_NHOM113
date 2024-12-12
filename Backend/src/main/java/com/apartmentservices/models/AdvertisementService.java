package com.apartmentservices.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Advertisement_Services")
public class AdvertisementService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer serviceId;

    @Column(name = "ServiceName", nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String serviceName;

    @Column(name = "ServiceNameNoAccent", nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String serviceNameNoDiacritics;

    @Column(name = "Description", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String description;

    @Column(name = "DeliveryAvailable", nullable = true)
    Boolean deliveryAvailable;

    // Ràng buộc ManyToOne tới Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryID", nullable = false)
    Category category;

    // Liên kết OneToMany để quản lý danh sách các hình ảnh/video cho dịch vụ quảng cáo
    @OneToMany(mappedBy = "advertisementService", cascade = CascadeType.ALL, orphanRemoval = true)
    List<AdvertisementServiceMedia> advertisementMedia;

    @Column(name = "IsActive", nullable = true)
    Boolean isActive;
}
