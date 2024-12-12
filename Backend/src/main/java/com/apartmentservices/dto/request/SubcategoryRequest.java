package com.apartmentservices.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubcategoryRequest {

    @NotBlank(message = "SUBCATEGORY_NAME_REQUIRED")
    String subcategoryName;
}
