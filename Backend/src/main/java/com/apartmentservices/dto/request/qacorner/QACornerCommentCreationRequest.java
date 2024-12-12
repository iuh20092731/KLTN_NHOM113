package com.apartmentservices.dto.request.qacorner;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QACornerCommentCreationRequest {

    Integer questionId;

    String commentText;

    String createdByUserId;

    LocalDateTime createDate;
}