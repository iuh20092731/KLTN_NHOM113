package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RealEstateMediaCreationRequest {

    @NotBlank(message = "MEDIA_URL_REQUIRED")
    String mediaUrl;

    @NotBlank(message = "MEDIA_TYPE_REQUIRED")
    String mediaType; // Ví dụ: "image/jpeg", "image/png"

    Integer seq; // Thứ tự hiển thị
}
