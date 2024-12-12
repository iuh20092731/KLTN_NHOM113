package com.apartmentservices.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FAQResponse {

    Integer faqId;
    String question;
    String answer;
    Integer advertisementId;
}
