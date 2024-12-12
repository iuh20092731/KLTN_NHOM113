package com.apartmentservices.models;

import com.apartmentservices.constant.RealEstateType;
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
@Table(name = "RealEstateListings")
public class RealEstateListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ListingID", nullable = false)
    Integer listingId;

    @Column(name = "Title", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci", nullable = false)
    String title;

    @Column(name = "Price", nullable = false)
    Double price;

    @Column(name = "Area", nullable = false)
    Double area; // Diện tích

    @Column(name = "PricePerSquareMeter", nullable = false)
    Double pricePerSquareMeter; // Giá tiền trên 1 m vuông

    @Column(name = "Bedrooms")
    Integer bedrooms;

    @Column(name = "Bathrooms")
    Integer bathrooms;

    @Column(name = "Address", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci", nullable = false)
    String address;

    @Column(name = "DetailedAddress", columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci", nullable = false)
    String detailedAddress;

    @Column(name = "Description", columnDefinition = "TEXT")
    String description;

    @ManyToOne
    @JoinColumn(name = "UserID", nullable = false)
    User user; // Người đăng

    @Column(name = "CreatedAt", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    LocalDateTime updatedAt;

    @Column(name = "ContactPhoneNumber", columnDefinition = "VARCHAR(15) COLLATE utf8mb4_unicode_ci", nullable = false)
    String contactPhoneNumber; // Số điện thoại liên hệ

    @Enumerated(EnumType.STRING)
    @Column(name = "RealEstateType", nullable = false)
    private RealEstateType realEstateType; // Loại bất động sản (Mua bán hay Cho thuê)
}
