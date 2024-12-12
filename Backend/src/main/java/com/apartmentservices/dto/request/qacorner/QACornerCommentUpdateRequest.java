package com.apartmentservices.dto.request.qacorner;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QACornerCommentUpdateRequest {

    String commentText;

    Integer updatedByUserId;
}
