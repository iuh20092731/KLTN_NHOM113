package com.apartmentservices.models.qacorner;

import com.apartmentservices.models.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "QACorner_Comments")
public class QACorner_Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "QuestionID", nullable = false)
    QACorner_Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCommentID", nullable = true)
    QACorner_Comment parentComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = true) // Cho phép ẩn danh
    User user;

    @Column(name = "Content", nullable = false, columnDefinition = "TEXT COLLATE utf8mb4_unicode_ci")
    String content;

    @Column(name = "CreatedAt", nullable = false)
    LocalDateTime createdAt;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    List<QACorner_Comment> replies;

}
