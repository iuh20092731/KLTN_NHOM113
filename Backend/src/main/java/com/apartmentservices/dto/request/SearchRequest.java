package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchRequest {

    @NotBlank(message = "KEYWORD_REQUIRED")
    @Size(min = 1, message = "INVALID_KEYWORD")
    String keyword;
}
