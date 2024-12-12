package com.apartmentservices.success;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum SuccessCode {
    BANNER_UPDATED(2001, "Banner updated successfully", HttpStatus.OK),
    USER_CREATED(2002, "User created successfully", HttpStatus.CREATED),
    BANNER_DELETED(2003, "Banner deleted successfully", HttpStatus.OK),
    ADVERTISEMENT_SERVICE_DELETED(2004, "Advertisement service deleted successfully", HttpStatus.OK),
    // Add more success codes as needed

    ;

    private final int code;
    private final String message;
    private final HttpStatus status;

    SuccessCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}