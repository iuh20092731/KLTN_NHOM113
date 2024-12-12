package com.apartmentservices.models.qacorner;

import com.apartmentservices.models.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "QACorner_Questions")
public class QACorner_Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer questionId;

    @Column(name = "Content", nullable = false, columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String content;

    @Column(name = "CreatedAt", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "Likes", nullable = false)
    Integer likes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = true) // Cho phép ẩn danh
    User user;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    List<QACorner_Comment> comments;

    @PrePersist
    public void prePersist() {
//        this.createdAt = LocalDateTime.now();
        if (this.likes == null) {
            this.likes = 0;
        }
    }
}
