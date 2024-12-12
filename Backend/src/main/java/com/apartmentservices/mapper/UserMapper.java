package com.apartmentservices.mapper;

import com.apartmentservices.dto.request.UserCreationRequest_V2;
import com.apartmentservices.dto.response.UserDetailResponse;
import com.apartmentservices.dto.response.UserInfoResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.apartmentservices.dto.request.UserCreationRequest;
import com.apartmentservices.dto.request.UserUpdateRequest;
import com.apartmentservices.dto.response.UserResponse;
import com.apartmentservices.models.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    User toUser_V2(UserCreationRequest_V2 request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "id", source = "userId")
    @Mapping(target = "avatar", source = "avatar")
    UserResponse toUserResponseForSearch(User user);

    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "avatar", source = "avatar")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "facebook", source = "facebook")
    @Mapping(target = "zalo", source = "zalo")
    UserInfoResponse toUserInfoResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    // Add the mapToUserResponse method
    UserResponse mapToUserResponse(User user);

    @Mapping(target = "isActive", source = "active")
    @Mapping(target = "userType", source = "userType")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    UserDetailResponse toUserDetailResponse(User user);
}
