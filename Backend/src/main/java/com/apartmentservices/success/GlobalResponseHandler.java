package com.apartmentservices.success;

import com.apartmentservices.success.ApiSuccessResponse;
import com.apartmentservices.success.SuccessCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class GlobalResponseHandler {

    public ResponseEntity<ApiSuccessResponse> buildSuccessResponse(SuccessCode successCode) {
        ApiSuccessResponse response = ApiSuccessResponse.builder()
                .code(successCode.getCode())
                .message(successCode.getMessage())
                .build();

        return ResponseEntity.status(successCode.getStatus()).body(response);
    }
}