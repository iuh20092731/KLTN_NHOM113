package com.apartmentservices.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(ErrorCode errorCode) {
        super(errorCode.getMessage());
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
