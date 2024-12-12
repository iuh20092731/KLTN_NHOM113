package com.apartmentservices.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.apartmentservices.models.MainAdvertisement;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MainAdvertisementCreationRequest {

    String mainAdvertisementName; // Tên quảng cáo chính
    Integer serviceId; // ID của dịch vụ quảng cáo (AdvertisementService)
    String advertiserId; // ID của người quảng cáo (Advertiser)
    String adminId; // ID của admin (có thể null)

    LocalDateTime adStartDate; // Ngày bắt đầu quảng cáo
    LocalDateTime adEndDate; // Ngày kết thúc quảng cáo
    String reviewNotes; // Ghi chú đánh giá
    String description; // Mô tả ngắn
    String detailedDescription; // Mô tả chi tiết
    String address; // Địa chỉ
    String phoneNumber; // Số điện thoại liên hệ
    BigDecimal priceRangeLow; // Mức giá thấp nhất
    BigDecimal priceRangeHigh; // Mức giá cao nhất
    LocalTime openingHourStart; // Giờ mở cửa bắt đầu
    LocalTime openingHourEnd; // Giờ mở cửa kết thúc
    String googleMapLink; // Link Google Maps
    String websiteLink; // Link website (nếu có)
    Boolean deliveryAvailable;
    String zaloLink; // Link Zalo (nếu có)
    String facebookLink; // Link Facebook (nếu có)


    // Trạng thái quảng cáo (Pending, Approved, Rejected, Active, Inactive)
    MainAdvertisement.AdStatus adStatus;

    // Danh sách các phương tiện truyền thông (media)
    List<AdvertisementMediaCreationRequest> mediaList;
}
