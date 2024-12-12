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
@Table(name = "Questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QuestionID")
    Integer questionId;

    // Ràng buộc ManyToOne tới Advertisement
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertisementID", nullable = false)
    MainAdvertisement advertisement;

    // Ràng buộc ManyToOne tới User (người đặt câu hỏi)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    User user;

    @Column(name = "QuestionContent", columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci", nullable = false)
    String questionContent;

    @Column(name = "QuestionDate", nullable = true)
    LocalDateTime questionDate;

}
