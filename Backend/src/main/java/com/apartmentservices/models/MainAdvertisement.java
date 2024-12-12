package com.apartmentservices.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Advertisements")
public class MainAdvertisement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AdvertisementID", nullable = false)
    Integer advertisementId;

    @Column(name = "MainAdvertisementName", length = 255, nullable = false, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String mainAdvertisementName;

    // Ràng buộc ManyToOne tới AdvertisementService
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceID", nullable = false)
    AdvertisementService advertisementService;

    // Ràng buộc ManyToOne tới Advertiser (User entity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertiserID", nullable = false)
    User advertiser;

    // Ràng buộc ManyToOne tới Admin (User entity, Admin can be null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdminID")
    User admin;

    @Column(name = "AdStartDate", nullable = false)
    LocalDateTime adStartDate;

    @Column(name = "AdEndDate", nullable = false)
    LocalDateTime adEndDate;

    @Column(name = "Clicks", columnDefinition = "INT DEFAULT 0")
    Integer clicks;

    // Thêm trường lưu số lượt xem
    @Column(name = "Views", columnDefinition = "INT DEFAULT 0")
    Integer views;

    // Thêm trường lưu số lượt thích
    @Column(name = "Likes", columnDefinition = "INT DEFAULT 0")
    Integer likes;

    // Trường lưu số lượt đã lưu (saved)
    @Column(name = "Saved", columnDefinition = "INT DEFAULT 0")
    Integer saved;

    // Trường lưu số lượt chia sẻ (shared)
    @Column(name = "Shared", columnDefinition = "INT DEFAULT 0")
    Integer shared;

    // Trường lưu khoảng cách
    @Column(name = "Distance", precision = 10, scale = 2)
    BigDecimal distance;

    @Enumerated(EnumType.STRING)
    @Column(name = "AdStatus")
    AdStatus adStatus;

    @Column(name = "ReviewNotes", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String reviewNotes;

    @Column(name = "Description", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String description;

    @Column(name = "DetailedDescription", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String detailedDescription;

    @Column(name = "Address", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String address;

    @Column(name = "PhoneNumber", length = 20)
    String phoneNumber;

    @Column(name = "PriceRangeLow", precision = 10, scale = 2)
    BigDecimal priceRangeLow;

    @Column(name = "PriceRangeHigh", precision = 10, scale = 2)
    BigDecimal priceRangeHigh;

    @Column(name = "OpeningHourStart")
    LocalTime openingHourStart;

    @Column(name = "OpeningHourEnd")
    LocalTime openingHourEnd;

    @Column(name = "GoogleMapLink", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String googleMapLink;

    @Column(name = "WebsiteLink", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String websiteLink;

    @Column(name = "ZaloLink", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String zaloLink;

    @Column(name = "FacebookLink", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String facebookLink;

    @Column(name = "DeliveryAvailable", nullable = true)
    Boolean deliveryAvailable;

    @Column(name = "CreateTime", nullable = true)
    LocalDateTime createTime;

    @Column(name = "LastUpdateTime", nullable = true)
    LocalDateTime lastUpdateTime;

    @Column(name = "LastUserUpdate", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci", nullable = true)
    String lastUserUpdate;


    @OneToMany(mappedBy = "advertisement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<AdvertisementMedia> advertisementMedia;

    // Enumeration for Ad Status
    public enum AdStatus {
        Pending //Chờ xử lý
        , Approved  //Đã phê duyệt
        , Rejected  //Bị từ chối
        , Active    //Đang hoạt động
        , Inactive  //Ngưng hoạt động
    }

    @PrePersist
    public void prePersist() {
        this.createTime = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdateTime = LocalDateTime.now();
    }
}
