package com.apartmentservices.services;

import com.apartmentservices.constant.BannerType;
import com.apartmentservices.dto.request.BannerCreationRequest;
import com.apartmentservices.dto.request.BannerUpdateRequest;
import com.apartmentservices.dto.response.BannerResponse;
import com.apartmentservices.models.Banner;

import java.util.List;

public interface BannerService {
    BannerResponse createBanner(BannerCreationRequest request, Boolean isActive);

    BannerResponse createBanner_V2(BannerCreationRequest request, Boolean isActive);

    List<BannerResponse> getAllBanners();

    BannerResponse getBannerById(Integer bannerId);

    BannerResponse updateBanner(Integer bannerId, BannerUpdateRequest request);

    void deleteBanner(Integer bannerId);

    List<BannerResponse> getBannersByType(BannerType type);

    List<BannerResponse> getBannersByTypeAndSeq(BannerType type, int seq);

    void updateBannerStatus(Integer bannerId, Boolean isActive);

    void updateBannerStatusWithAd(Integer advertisementId, Boolean isActive);

    void updateBannerStatusIfExists(Integer advertisementId, Boolean isActive);

    void updateBanners(List<Banner> banners);

    List<BannerResponse> getAllRightBannersWithMaxSerial();
}
