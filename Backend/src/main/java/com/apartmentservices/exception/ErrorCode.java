package com.apartmentservices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD(1009, "Incorrect password", HttpStatus.BAD_REQUEST),
    ACTIVE_USER_NOT_FOUND(2001, "ActiveUser not found", HttpStatus.NOT_FOUND),
    ACTIVE_USER_CREATION_FAILED(2002, "Failed to create ActiveUser", HttpStatus.BAD_REQUEST),
    ACTIVE_USER_UPDATE_FAILED(2003, "Failed to update ActiveUser", HttpStatus.BAD_REQUEST),
    ACTIVE_USER_DELETION_FAILED(2004, "Failed to delete ActiveUser", HttpStatus.BAD_REQUEST),
    USER_CREATION_FAILED(2005, "Failed to create User", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(2006, "User not found", HttpStatus.NOT_FOUND),
    ACTIVITY_LOG_NOT_FOUND(3001, "ActivityLog not found", HttpStatus.NOT_FOUND),
    ACTIVITY_LOG_CREATION_FAILED(3002, "Failed to create ActivityLog", HttpStatus.BAD_REQUEST),
    ACTIVITY_LOG_UPDATE_FAILED(3003, "Failed to update ActivityLog", HttpStatus.BAD_REQUEST),
    ACTIVITY_LOG_DELETION_FAILED(3004, "Failed to delete ActivityLog", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(4001, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_CREATION_FAILED(4002, "Failed to create Category", HttpStatus.BAD_REQUEST),
    CATEGORY_UPDATE_FAILED(4003, "Failed to update Category", HttpStatus.BAD_REQUEST),
    CATEGORY_DELETION_FAILED(4004, "Failed to delete Category", HttpStatus.BAD_REQUEST),
    SUBCATEGORY_NOT_FOUND(5001, "Subcategory not found", HttpStatus.NOT_FOUND),
    SUBCATEGORY_CREATION_FAILED(5002, "Failed to create Subcategory", HttpStatus.BAD_REQUEST),
    SUBCATEGORY_UPDATE_FAILED(5003, "Failed to update Subcategory", HttpStatus.BAD_REQUEST),
    SUBCATEGORY_DELETION_FAILED(5004, "Failed to delete Subcategory", HttpStatus.BAD_REQUEST),
    SERVICE_NOT_FOUND(6001, "Service not found", HttpStatus.NOT_FOUND),
    SERVICE_CREATION_FAILED(6002, "Failed to create Service", HttpStatus.BAD_REQUEST),
    SERVICE_UPDATE_FAILED(6003, "Failed to update Service", HttpStatus.BAD_REQUEST),
    SERVICE_DELETION_FAILED(6004, "Failed to delete Service", HttpStatus.BAD_REQUEST),
    SERVICE_MEDIA_NOT_FOUND(7001, "ServiceMedia not found", HttpStatus.NOT_FOUND),
    SERVICE_MEDIA_CREATION_FAILED(7002, "Failed to create ServiceMedia", HttpStatus.BAD_REQUEST),
    SERVICE_MEDIA_UPDATE_FAILED(7003, "Failed to update ServiceMedia", HttpStatus.BAD_REQUEST),
    SERVICE_MEDIA_DELETION_FAILED(7004, "Failed to delete ServiceMedia", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_NOT_FOUND(8001, "AdvertisementService not found", HttpStatus.NOT_FOUND),
    ADVERTISEMENT_SERVICE_CREATION_FAILED(8002, "Failed to create AdvertisementService", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_UPDATE_FAILED(8003, "Failed to update AdvertisementService", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_DELETION_FAILED(8004, "Failed to delete AdvertisementService", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_MEDIA_NOT_FOUND(9001, "AdvertisementServiceMedia not found", HttpStatus.NOT_FOUND),
    ADVERTISEMENT_SERVICE_MEDIA_CREATION_FAILED(9002, "Failed to create AdvertisementServiceMedia", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_MEDIA_UPDATE_FAILED(9003, "Failed to update AdvertisementServiceMedia", HttpStatus.BAD_REQUEST),
    ADVERTISEMENT_SERVICE_MEDIA_DELETION_FAILED(9004, "Failed to delete AdvertisementServiceMedia", HttpStatus.BAD_REQUEST),
    MAIN_ADVERTISEMENT_NOT_FOUND(10001, "MainAdvertisement not found", HttpStatus.NOT_FOUND),
    MAIN_ADVERTISEMENT_CREATION_FAILED(10002, "Failed to create MainAdvertisement", HttpStatus.BAD_REQUEST),
    MAIN_ADVERTISEMENT_UPDATE_FAILED(10003, "Failed to update MainAdvertisement", HttpStatus.BAD_REQUEST),
    MAIN_ADVERTISEMENT_DELETION_FAILED(10004, "Failed to delete MainAdvertisement", HttpStatus.BAD_REQUEST),
    REVIEW_NOT_FOUND(11001, "Review not found", HttpStatus.NOT_FOUND),
    REVIEW_CREATION_FAILED(11002, "Failed to create Review", HttpStatus.BAD_REQUEST),
    FAQ_NOT_FOUND(12001, "FAQ not found", HttpStatus.NOT_FOUND),
    FAQ_CREATION_FAILED(12002, "Failed to create FAQ", HttpStatus.BAD_REQUEST),
    FAQ_UPDATE_FAILED(12003, "Failed to update FAQ", HttpStatus.BAD_REQUEST),
    FAQ_DELETION_FAILED(12004, "Failed to delete FAQ", HttpStatus.BAD_REQUEST),
    SEARCH_FAILED(13001, "Search operation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    SEARCH_EMPTY(13002, "No result found", HttpStatus.NOT_FOUND),
    OTP_NOT_FOUND(14001, "OTP not found", HttpStatus.NOT_FOUND),
    INVALID_OTP(14002, "Invalid OTP", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(14003, "OTP expired", HttpStatus.BAD_REQUEST),
    POST_NOT_FOUND(15001, "Post not found", HttpStatus.NOT_FOUND),
    LISTING_NOT_FOUND(15002, "Listing not found", HttpStatus.NOT_FOUND),
    MEDIA_NOT_FOUND(15003, "Media not found", HttpStatus.NOT_FOUND),
    BANNER_NOT_FOUND(15004, "Banner not found", HttpStatus.NOT_FOUND),
    ADVERTISEMENT_MEDIA_NOT_FOUND(15005, "AdvertisementMedia not found", HttpStatus.NOT_FOUND),
    INVALID_MEDIA_URL(15006, "Invalid media URL", HttpStatus.BAD_REQUEST),
    BANNER_IMAGE_DELETE_FAILED(15007, "Failed to delete banner image", HttpStatus.BAD_REQUEST),
    MEDIA_DELETION_FAILED(15008, "Failed to delete media", HttpStatus.BAD_REQUEST),

    ;


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
