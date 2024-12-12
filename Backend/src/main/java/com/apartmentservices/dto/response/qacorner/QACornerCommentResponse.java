package com.apartmentservices.dto.response.qacorner;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QACornerCommentResponse {
    Integer commentId;
    Integer questionId;
    String commentText;
    Integer createdByUserId;
    LocalDateTime createdDate;
    Integer updatedByUserId;
    LocalDateTime updatedDate;
    Integer parentCommentId; // Nếu có, ID của comment cha (nếu là reply)
}
