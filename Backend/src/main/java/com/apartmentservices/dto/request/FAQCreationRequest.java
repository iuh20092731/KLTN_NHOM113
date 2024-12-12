package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FAQCreationRequest {

    @NotBlank(message = "QUESTION_REQUIRED")
    String question;

    @NotBlank(message = "ANSWER_REQUIRED")
    String answer;

    @NotBlank(message = "ADVERTISEMENT_ID_REQUIRED")
    Integer advertisementId;
}
