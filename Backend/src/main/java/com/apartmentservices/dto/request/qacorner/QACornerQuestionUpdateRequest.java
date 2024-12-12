package com.apartmentservices.dto.request.qacorner;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QACornerQuestionUpdateRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;
    // Các trường khác nếu có
}
