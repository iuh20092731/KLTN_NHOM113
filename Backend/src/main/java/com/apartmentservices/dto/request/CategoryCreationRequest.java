package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreationRequest {

    @NotNull(message = "CATEGORY_SEQ_REQUIRED")
    Integer categorySeq;

    @NotBlank(message = "CATEGORY_NAME_REQUIRED")
    @Size(min = 1, message = "INVALID_CATEGORY_NAME")
    String categoryName;

    String categoryNameNoDiacritics;

    Boolean isActive;

    String imageLink;
}
