package com.apartmentservices.models;

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
@Table(name = "FAQs")
public class FAQ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FAQID")
    Integer faqId;

    @Column(name = "Question", nullable = false, columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String question;

    @Column(name = "Answer", nullable = false, columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String answer;

    // Ràng buộc ManyToOne tới Advertisement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertisementID", nullable = false)
    MainAdvertisement advertisement;
}
