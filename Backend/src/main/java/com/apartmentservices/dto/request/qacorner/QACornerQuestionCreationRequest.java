package com.apartmentservices.dto.request.qacorner;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QACornerQuestionCreationRequest {
    @NotBlank(message = "Content cannot be empty")
    String content;

    String createdByUserId;

    LocalDateTime createDate;
}
