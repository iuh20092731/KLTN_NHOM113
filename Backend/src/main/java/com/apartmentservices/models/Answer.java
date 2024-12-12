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
@Table(name = "Answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AnswerID", nullable = false)
    Integer answerId;

    // Ràng buộc ManyToOne tới Question
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QuestionID", nullable = false)
    Question question;

    // Ràng buộc ManyToOne tới Advertiser (User entity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AdvertiserID", nullable = false)
    User advertiser;

    @Column(name = "AnswerContent", columnDefinition = "TEXT", nullable = false)
    String answerContent;

    @Column(name = "AnswerDate")
    LocalDateTime answerDate;
}
