package com.apartmentservices.services;

import com.apartmentservices.constant.BannerType;
import com.apartmentservices.dto.request.BannerCreationRequest;
import com.apartmentservices.dto.request.BannerUpdateRequest;
import com.apartmentservices.dto.response.BannerResponse;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.BannerMapper;
import com.apartmentservices.models.Banner;
import com.apartmentservices.repositories.BannerRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BannerServiceImpl implements BannerService {

    BannerRepository bannerRepository;
    BannerMapper bannerMapper;

    CloudinaryService cloudinaryService;

    @Override
    public BannerResponse createBanner(BannerCreationRequest request, Boolean isActive) {
        // Tạo đối tượng Banner từ request
        Banner banner = bannerMapper.toBanner(request);

        // Thiết lập các giá trị mặc định
        banner.setStartDate(LocalDateTime.now());  // Ngày bắt đầu là ngày hiện tại
        banner.setEndDate(LocalDateTime.of(2100, 12, 30, 0, 0, 0)); // Ngày kết thúc là ngày tối đa
        banner.setIsActive(isActive);                   // Mặc định là active

        if (request.getSeq() != null) {
            // Nếu seq được cung cấp trong request, sử dụng giá trị đó
            banner.setSeq(request.getSeq());

            // Tạo biến tạm lưu seq
            int currentSeq = banner.getSeq();

            // Lấy serial lớn nhất hiện tại cho seq này
            int maxSerial = bannerRepository.findByType(banner.getType()).stream()
                    .filter(b -> b.getSeq() == currentSeq)
                    .mapToInt(Banner::getSerial)
                    .max()
                    .orElse(0); // Nếu không có banner nào, maxSerial sẽ là 0

            banner.setSerial(maxSerial + 1); // Tăng serial lên 1
        } else {
            // Nếu seq không được cung cấp, xác định seq lớn nhất
            List<Banner> existingBanners = bannerRepository.findByType(banner.getType());
            int maxSeq = existingBanners.stream()
                    .mapToInt(Banner::getSeq)
                    .max()
                    .orElse(0);

            // Thiết lập seq cho banner mới
            banner.setSeq(maxSeq + 1);

            // Tạo biến tạm lưu seq
            int currentSeq = banner.getSeq();

            // Thiết lập serial cho banner mới
            // Lấy serial lớn nhất hiện tại cho seq này
            int maxSerial = bannerRepository.findByType(banner.getType()).stream()
                    .filter(b -> b.getSeq() == currentSeq)
                    .mapToInt(Banner::getSerial)
                    .max()
                    .orElse(0); // Nếu không có banner nào, maxSerial sẽ là 0

            banner.setSerial(maxSerial + 1); // Tăng serial lên 1
        }

        // Lưu banner vào repository
        banner = bannerRepository.save(banner);

        return bannerMapper.toBannerResponse(banner);
    }

    @Override
    public BannerResponse createBanner_V2(BannerCreationRequest request, Boolean isActive) {
        // Tạo đối tượng Banner từ request
        Banner banner = bannerMapper.toBanner(request);

        // Thiết lập các giá trị mặc định
        banner.setStartDate(LocalDateTime.now());  // Ngày bắt đầu là ngày hiện tại
        banner.setEndDate(LocalDateTime.of(2100, 12, 30, 0, 0, 0)); // Ngày kết thúc là ngày tối đa
        banner.setIsActive(isActive);             // Mặc định là active

        // Kiểm tra và trích xuất advertisementId từ linkUrl nếu cần
        if (request.getAdvertisementId() == null && request.getLinkUrl() != null) {
            String linkUrl = request.getLinkUrl();
            Pattern pattern = Pattern.compile("^/[^/]+/\\d+$");
            Matcher matcher = pattern.matcher(linkUrl);

            if (matcher.find()) {
                String extractedId = matcher.group(1); // Lấy số cuối cùng từ linkUrl
                banner.setAdvertisementId(Integer.parseInt(extractedId));
            }
        } else {
            banner.setAdvertisementId(request.getAdvertisementId()); // Sử dụng giá trị từ request nếu có
        }

        if (request.getSeq() != null) {
            // Nếu seq được cung cấp trong request, sử dụng giá trị đó
            banner.setSeq(request.getSeq());

            // Tạo biến tạm lưu seq
            int currentSeq = banner.getSeq();

            // Lấy serial lớn nhất hiện tại cho seq này
            int maxSerial = bannerRepository.findByType(banner.getType()).stream()
                    .filter(b -> b.getSeq() == currentSeq)
                    .mapToInt(Banner::getSerial)
                    .max()
                    .orElse(0); // Nếu không có banner nào, maxSerial sẽ là 0

            banner.setSerial(maxSerial + 1); // Tăng serial lên 1
        } else {
            // Nếu seq không được cung cấp, xác định seq lớn nhất
            List<Banner> existingBanners = bannerRepository.findByType(banner.getType());
            int maxSeq = existingBanners.stream()
                    .mapToInt(Banner::getSeq)
                    .max()
                    .orElse(0);

            // Thiết lập seq cho banner mới
            banner.setSeq(maxSeq + 1);

            // Tạo biến tạm lưu seq
            int currentSeq = banner.getSeq();

            // Thiết lập serial cho banner mới
            int maxSerial = bannerRepository.findByType(banner.getType()).stream()
                    .filter(b -> b.getSeq() == currentSeq)
                    .mapToInt(Banner::getSerial)
                    .max()
                    .orElse(0); // Nếu không có banner nào, maxSerial sẽ là 0

            banner.setSerial(maxSerial + 1); // Tăng serial lên 1
        }

        // Lưu banner vào repository
        banner = bannerRepository.save(banner);

        return bannerMapper.toBannerResponse(banner);
    }



    @Override
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAll().stream()
                .map(bannerMapper::toBannerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BannerResponse getBannerById(Integer bannerId) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        return bannerMapper.toBannerResponse(banner);
    }

    @Override
    public BannerResponse updateBanner(Integer bannerId, BannerUpdateRequest request) {
        Banner existingBanner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));

        bannerMapper.updateBanner(existingBanner, request);
        existingBanner = bannerRepository.save(existingBanner);

        return bannerMapper.toBannerResponse(existingBanner);
    }

    @Override
    @Transactional
    public void deleteBanner(Integer bannerId) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));

        if (banner.getImageUrl() != null) {
            String publicId = extractPublicId(banner.getImageUrl());
//            log.info("Extracted publicId: {}", publicId);
            if (publicId != null) {
                try {
                    String s = cloudinaryService.deleteFile(publicId);
                    log.info("Deleted image on Cloudinary: {}", s);
                } catch (Exception e) {
                    log.error("Error deleting image on Cloudinary: {}", e.getMessage());
                    throw new AppException(ErrorCode.BANNER_IMAGE_DELETE_FAILED);
                }
            } else {
                log.warn("Could not extract publicId from imageUrl: {}", banner.getImageUrl());
            }
        }
        bannerRepository.deleteById(bannerId);
    }

    private String extractPublicId(String url) {
        if (url == null || !url.contains("/")) {
            return null;
        }
        try {
            int lastSlashIndex = url.lastIndexOf("/");
            int dotIndex = url.lastIndexOf(".");
            if (lastSlashIndex != -1 && dotIndex != -1 && lastSlashIndex < dotIndex)    {
                return url.substring(lastSlashIndex + 1, dotIndex);
            }
            return null;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_MEDIA_URL);
        }
    }


    @Override
    public List<BannerResponse> getBannersByType(BannerType type) {
        return bannerRepository.findBannersByTypeOrderBySeqAndSerial(type.name()).stream()
                .map(bannerMapper::toBannerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BannerResponse> getBannersByTypeAndSeq(BannerType type, int seq) {
        List<Banner> banners = bannerRepository.findByTypeAndSeqOrderBySeqAndSerial(type.name(), seq);
        return bannerMapper.toBannerResponses(banners);
    }


    @Override
    public void updateBannerStatus(Integer bannerId, Boolean isActive) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        banner.setIsActive(isActive);
        bannerRepository.save(banner);
    }

    @Override
    public void updateBannerStatusWithAd(Integer advertisementId, Boolean isActive) {
        Banner banner = bannerRepository.findByAdvertisementId(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.BANNER_NOT_FOUND));
        banner.setIsActive(isActive);
        bannerRepository.save(banner);
    }

    @Override
    public void updateBannerStatusIfExists(Integer advertisementId, Boolean isActive) {
        bannerRepository.findByAdvertisementId(advertisementId).ifPresent(banner -> {
            banner.setIsActive(isActive);
            bannerRepository.save(banner);
        });
    }

    @Override
    public void updateBanners(List<Banner> banners) {
        bannerRepository.saveAll(banners);
    }

    @Override
    public List<BannerResponse> getAllRightBannersWithMaxSerial() {
        List<Banner> banners = bannerRepository.findAllRightBannersWithMaxSerial();
        return bannerMapper.toBannerResponses(banners);
    }

}
