package com.apartmentservices.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "Categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer categoryId;

    // Thêm thuộc tính categorySeq
    @Column(name = "CategorySeq", nullable = false, unique = true)
    Integer categorySeq;

    @Column(name = "CategoryName", nullable = false, length = 100, columnDefinition = "VARCHAR(100) COLLATE utf8mb4_unicode_ci")
    String categoryName;

    @Column(name = "Remark", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String remark;

    @Column(name = "ImageLink", length = 255, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String imageLink;

    @Column(name = "IsActive", nullable = false)
    Boolean isActive;  // Hibernate tự động ánh xạ Boolean thành 1 hoặc 0 trong cơ sở dữ liệu

    // Thêm thuộc tính createdDate và updatedDate
    @CreationTimestamp
    @Column(name = "CreatedDate", updatable = false)
    LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "UpdatedDate")
    LocalDateTime updatedDate;

    @Column(name = "CategoryNameNoDiacritics", nullable = false, length = 100, columnDefinition = "VARCHAR(100) COLLATE utf8mb4_unicode_ci")
    String categoryNameNoDiacritics;

    // Liên kết OneToMany tới AdvertisementService (từng category có thể có nhiều dịch vụ)
    @OneToMany(mappedBy = "category")
    List<AdvertisementService> advertisementServices;
}
