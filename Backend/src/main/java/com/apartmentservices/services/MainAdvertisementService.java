package com.apartmentservices.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.apartmentservices.constant.BannerType;
import com.apartmentservices.dto.request.*;
import com.apartmentservices.dto.response.*;
import com.apartmentservices.models.AdvertisementMedia;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.repositories.AdvertisementMediaRepository;
import com.apartmentservices.repositories.AdvertisementServiceRepository;
import com.apartmentservices.repositories.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.mapper.MainAdvertisementMapper;
import com.apartmentservices.models.MainAdvertisement;
import com.apartmentservices.repositories.MainAdvertisementRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MainAdvertisementService {

    MainAdvertisementRepository mainAdvertisementRepository;
    AdvertisementMediaRepository advertisementMediaRepository;
    AdvertisementServiceRepository advertisementServiceRepository;
    AdvertisementServiceService advertisementServiceService;
    EmailService emailService;

    CloudinaryService cloudinaryService;
    AdvertisementMediaService advertisementMediaService;
    BannerService bannerService;
    ReviewRepository reviewRepository;
    MainAdvertisementMapper mainAdvertisementMapper;


    @Transactional(readOnly = true)
    public List<MainAdvertisementResponse> getAdvertisementsByUserId(String userId) {
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertiser_UserId(userId);
        return advertisements.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MainAdvertisementResponse> getTopRestaurantsByServiceId(Integer serviceId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        // Lấy danh sách quảng cáo của quán ăn theo serviceId và sắp xếp theo độ nổi bật
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementService_ServiceIdOrderByClicksDescViewsDescLikesDescSharedDescSavedDesc(serviceId, pageable);

        // Chuyển đổi danh sách quảng cáo thành danh sách response DTO và thiết lập reviewCount, averageRating
        return advertisements.stream()
                .map(advertisement -> {
                    // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementResponse response = mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }



    @Transactional
    public MainAdvertisementResponse createAdvertisement(MainAdvertisementCreationRequest request) {
        MainAdvertisement advertisement = mainAdvertisementMapper.toMainAdvertisement(request);

        try {
            advertisement = mainAdvertisementRepository.save(advertisement);
            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
        } catch (Exception e) {
            log.error("Error creating advertisement", e);
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_CREATION_FAILED);
        }
    }

//    @Transactional
//    public MainAdvertisementResponse_V2 createAdvertisement_V2(MainAdvertisementCreationRequest request) {
//        // Chuyển đổi từ DTO sang entity MainAdvertisement
//        MainAdvertisement advertisement = mainAdvertisementMapper.toMainAdvertisement(request);
//        advertisement.setClicks(0);
//        advertisement.setViews(0);
//        advertisement.setLikes(0);
//        try {
//            // Lưu quảng cáo và gán vào biến finalAdvertisement
//            final MainAdvertisement finalAdvertisement = mainAdvertisementRepository.save(advertisement);
//
//            // Lưu media nếu có
//            if (request.getMediaList() != null && !request.getMediaList().isEmpty()) {
//                List<AdvertisementMedia> mediaList = request.getMediaList().stream()
//                        .filter(mediaRequest -> mediaRequest.getUrl() != null && !mediaRequest.getUrl().isEmpty()) // Bỏ qua nếu URL rỗng hoặc null
//                        .map(mediaRequest -> {
//                            AdvertisementMedia media = new AdvertisementMedia();
//                            media.setName(mediaRequest.getName());
//                            media.setContent(mediaRequest.getContent());
//                            media.setUrl(mediaRequest.getUrl());
//                            media.setType(mediaRequest.getType());
//                            media.setAdvertisement(finalAdvertisement); // Liên kết media với quảng cáo đã được lưu
//                            return media;
//                        }).collect(Collectors.toList());
//
//                // Lưu danh sách media (chỉ các media có URL hợp lệ)
//                advertisementMediaRepository.saveAll(mediaList);
//            }
//
//            // Trả về response
//            return mainAdvertisementMapper.toMainAdvertisementResponse_V2(finalAdvertisement);
//        } catch (Exception e) {
//            log.error("Error creating advertisement", e);
//            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_CREATION_FAILED);
//        }
//    }

    @Transactional
    public MainAdvertisementResponse_V2 createAdvertisement_V2(MainAdvertisementCreationRequest request) {
        // Chuyển đổi từ DTO sang entity MainAdvertisement
        MainAdvertisement advertisement = mainAdvertisementMapper.toMainAdvertisement(request);
        advertisement.setClicks(0);
        advertisement.setViews(0);
        advertisement.setLikes(0);

        try {
            // Lưu quảng cáo và gán vào biến finalAdvertisement
            final MainAdvertisement finalAdvertisement = mainAdvertisementRepository.save(advertisement);

            // Lưu media nếu có
            if (request.getMediaList() != null && !request.getMediaList().isEmpty()) {
                List<AdvertisementMedia> mediaList = request.getMediaList().stream()
                        .filter(mediaRequest -> mediaRequest.getUrl() != null && !mediaRequest.getUrl().isEmpty()) // Bỏ qua nếu URL rỗng hoặc null
                        .map(mediaRequest -> {
                            AdvertisementMedia media = new AdvertisementMedia();
                            media.setName(mediaRequest.getName());
                            media.setContent(mediaRequest.getContent());
                            media.setUrl(mediaRequest.getUrl());
                            media.setType(mediaRequest.getType());
                            media.setAdvertisement(finalAdvertisement); // Liên kết media với quảng cáo đã được lưu
                            return media;
                        }).collect(Collectors.toList());

                // Lưu danh sách media (chỉ các media có URL hợp lệ)
                advertisementMediaRepository.saveAll(mediaList);
            }

            // Lấy thông tin category từ serviceId
            String categoryNameNoDiacritics = getCategoryNameByServiceId(request.getServiceId());

            // Lấy URL của hình ảnh từ media đầu tiên (nếu có)
            String imageUrl = request.getMediaList() != null && !request.getMediaList().isEmpty()
                    ? request.getMediaList().get(0).getUrl()
                    : null;

            // Kiểm tra nếu imageUrl hợp lệ thì mới tạo Banner
//            if (imageUrl != null && !imageUrl.isEmpty()) {
//                // Tạo Banner mới cho quảng cáo
//                BannerCreationRequest bannerRequest = BannerCreationRequest.builder()
//                        .imageUrl(imageUrl)
//                        .linkUrl("/" + categoryNameNoDiacritics + "/" + finalAdvertisement.getAdvertisementId())
//                        .title(finalAdvertisement.getMainAdvertisementName())
//                        .type(BannerType.TOP)
//                        .seq(1)
//                        .advertisementId(finalAdvertisement.getAdvertisementId())
//                        .build();
//
//                bannerService.createBanner(bannerRequest, false);
//            }

            // Trả về response
            return mainAdvertisementMapper.toMainAdvertisementResponse_V2(finalAdvertisement);
        } catch (Exception e) {
            log.error("Error creating advertisement", e);
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_CREATION_FAILED);
        }
    }

    private String getCategoryNameByServiceId(Integer serviceId) {
        AdvertisementServiceResponse serviceResponse = advertisementServiceService.getAdvertisementService(serviceId);
        return serviceResponse.getCategoryNameNoDiacritics();
    }

    @Transactional
    public MainAdvertisementResponse_V2 createAdvertisement_V3(MainAdvertisementCreationRequest request) {
        // Chuyển đổi từ DTO sang entity MainAdvertisement
        MainAdvertisement advertisement = mainAdvertisementMapper.toMainAdvertisement(request);
        advertisement.setClicks(0);
        advertisement.setViews(0);
        advertisement.setLikes(0);

        try {
            // Lưu quảng cáo và gán vào biến finalAdvertisement
            final MainAdvertisement finalAdvertisement = mainAdvertisementRepository.save(advertisement);

            // Lưu media nếu có
            if (request.getMediaList() != null && !request.getMediaList().isEmpty()) {
                List<AdvertisementMedia> mediaList = request.getMediaList().stream()
                        .filter(mediaRequest -> mediaRequest.getUrl() != null && !mediaRequest.getUrl().isEmpty()) // Bỏ qua nếu URL rỗng hoặc null
                        .map(mediaRequest -> {
                            AdvertisementMedia media = new AdvertisementMedia();
                            media.setName(mediaRequest.getName());
                            media.setContent(mediaRequest.getContent());
                            media.setUrl(mediaRequest.getUrl());
                            media.setType(mediaRequest.getType());
                            media.setAdvertisement(finalAdvertisement); // Liên kết media với quảng cáo đã được lưu
                            return media;
                        }).collect(Collectors.toList());

                // Lưu danh sách media (chỉ các media có URL hợp lệ)
                advertisementMediaRepository.saveAll(mediaList);
            }

            // Lấy thông tin category từ serviceId
            String categoryNameNoDiacritics = getCategoryNameByServiceId(request.getServiceId());

            // Gửi email thông báo cho Admin
            String subject = "Thông báo: Quảng cáo mới đã được tạo";
            String body = String.format(
                    "<div style=\"text-align: center;\">" +
                            "<img src=\"https://res.cloudinary.com/tranquanghuyit09/image/upload/v1729711401/ApartmentServices/kqjykdmipbics2aiynne.png\" " +
                            "alt=\"Logo Dịch vụ Hưng Ngân\" style=\"width: 150px; height: auto;\">" +
                            "</div>" +
                            "<p>Xin chào <b>Admin</b>,</p>" +
                            "<p>Một quảng cáo mới đã được tạo với các thông tin chi tiết sau:</p>" +
                            "<table style=\"border-collapse: collapse; width: 100%%;\">" +  // Escape % thành %%
                            "<tr>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\"><b>Tên quảng cáo:</b></td>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\">%s</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\"><b>Dịch vụ:</b></td>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\">%s</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\"><b>Ngày tạo:</b></td>" +
                            "<td style=\"border: 1px solid #ddd; padding: 8px;\">%s</td>" +
                            "</tr>" +
                            "</table>" +
                            "<p>Vui lòng kiểm tra và xử lý nếu cần thiết.</p>" +
                            "<p>Khám phá ngay những dịch vụ tiện ích hàng đầu xung quanh Chung cư Hưng Ngân – " +
                            "Tận hưởng cuộc sống trọn vẹn với sự thuận tiện chỉ trong tầm tay!</p>" +
                            "<p><b>Facebook:</b> <a href=\"https://www.facebook.com/dichvuHungNganNew\">Dịch vụ Hưng Ngân</a><br>" +
                            "<b>YouTube:</b> <a href=\"https://www.youtube.com/@dichvuHungNgan\">Dịch vụ Hưng Ngân</a><br>" +
                            "<b>Email:</b> dichvuhungngan@gmail.com<br>" +
                            "<b>Số điện thoại:</b> 0909260517<br>" +
                            "<b>Địa chỉ:</b> Chung Cư Hưng Ngân - 48 Đường Thị Mười, Phường Tân Chánh Hiệp, Quận 12</p>" +
                            "<p>Cảm ơn bạn đã lựa chọn Dịch vụ Hưng Ngân!</p>" +
                            "<p>Trân trọng,<br>Đội ngũ Dịch vụ Hưng Ngân</p>",
                    finalAdvertisement.getMainAdvertisementName(),
                    categoryNameNoDiacritics,
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
            );


            // Gửi email đến danh sách Admin
            List<String> adminEmails = List.of(
                    "tranquanghuyit09@gmail.com",
                    "nguyenanhvu200101@gmail.com",
                    "nhandep09@gmail.com"
            );
            adminEmails.forEach(email -> emailService.sendEmail(email, subject, body, true));

            // Trả về response
            return mainAdvertisementMapper.toMainAdvertisementResponse_V2(finalAdvertisement);
        } catch (Exception e) {
            log.error("Error creating advertisement", e);
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_CREATION_FAILED);
        }
    }



    @Transactional
    public MainAdvertisementResponse getAdvertisement(Integer advertisementId) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
    }

//    @Transactional
//    public MainAdvertisementDetailResponse getAdvertisement_V2(Integer advertisementId) {
//        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
//                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));
//
//        return mainAdvertisementMapper.toMainAdvertisementDetailResponse(advertisement);
//    }

    @Transactional
    public MainAdvertisementDetailResponse getAdvertisement_V2(Integer advertisementId) {
        // Lấy quảng cáo dựa vào advertisementId
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
        Long reviewCount = reviewRepository.countByAdvertisementId(advertisementId);
        BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisementId);

        // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
        BigDecimal roundedAverageRating = (averageRating != null)
                ? averageRating.setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Sử dụng mapper để chuyển đổi sang MainAdvertisementDetailResponse
        MainAdvertisementDetailResponse response = mainAdvertisementMapper.toMainAdvertisementDetailResponse(advertisement);

        // Thiết lập reviewCount và averageRating vào response
        response.setReviewCount(reviewCount.intValue());
        response.setAverageRating(roundedAverageRating);

        return response;
    }


    @Transactional
    public List<MainAdvertisementResponse> getAllAdvertisements() {
        return mainAdvertisementRepository.findAll().stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

//    @Transactional
//    public Page<MainAdvertisementResponse> getAllAdvertisementspagination(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        Page<MainAdvertisement> advertisements = mainAdvertisementRepository.findAll(pageable);
//        return advertisements.map(mainAdvertisementMapper::toMainAdvertisementResponse);
//    }

    @Transactional
    public Page<MainAdvertisementResponse> getAllAdvertisementspagination(int page, int size, MainAdvertisement.AdStatus adStatus) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MainAdvertisement> advertisements;

        if (adStatus != null) {
            // Truy vấn có lọc theo AdStatus
            advertisements = mainAdvertisementRepository.findAllByAdStatus(adStatus, pageable);
        } else {
            // Truy vấn tất cả nếu không có AdStatus
            advertisements = mainAdvertisementRepository.findAll(pageable);
        }

        return advertisements.map(mainAdvertisementMapper::toMainAdvertisementResponse);
    }




    @Transactional
    public List<MainAdvertisementResponse> getAllAdvertisementsAdStatus(String adStatus) {
        return mainAdvertisementRepository.findMainAdvertisementByAdStatus(adStatus).stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

//    @Transactional
//    public MainAdvertisementResponse updateAdvertisement(Integer advertisementId, MainAdvertisementUpdateRequest request) {
//        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
//                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));
//
//        mainAdvertisementMapper.updateMainAdvertisement(advertisement, request);
//
//        try {
//            advertisement = mainAdvertisementRepository.save(advertisement);
//            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
//        } catch (Exception e) {
//            log.error("Error updating advertisement", e);
//            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
//        }
//    }

    @Transactional
    public MainAdvertisementResponse updateAdvertisement(Integer advertisementId, MainAdvertisementUpdateRequest request) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        // Sử dụng mapper để cập nhật chỉ các field cho phép trong `request`
        mainAdvertisementMapper.updateMainAdvertisement(advertisement, request);

        try {
            advertisement = mainAdvertisementRepository.save(advertisement);
            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
        } catch (Exception e) {
            log.error("Error updating advertisement with ID {}: {}", advertisementId, e.getMessage());
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
        }
    }

    @Transactional
    public MainAdvertisementResponse updateAdvertisement_V2(Integer advertisementId, MainAdvertisementUpdateRequest_V2 request) {
        // Tìm kiếm advertisement trong database
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        // Cập nhật các trường cơ bản
        mainAdvertisementMapper.updateMainAdvertisement_V2(advertisement, request);
        System.out.println("request" + request);
        // Xử lý cập nhật AdvertisementService nếu có
        if (request.getServiceId() != null) {

            AdvertisementService advertisementService = advertisementServiceRepository.findById(request.getServiceId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));
            System.out.println("advertisementService: " + advertisementService);
            advertisement.setAdvertisementService(advertisementService);
        }

        // Xử lý danh sách AdvertisementMedia
        if (request.getAdvertisementMedia() != null) {
            // Lấy danh sách ID từ request
            List<Integer> requestMediaIds = request.getAdvertisementMedia().stream()
                    .map(AdvertisementMediaUpdateRequest_V2::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // Tìm media hiện có trong database
            List<AdvertisementMedia> currentMediaList = advertisementMediaService.getAllMediaByAdvertisement(advertisementId);

            // Xóa media không có trong request
            for (AdvertisementMedia currentMedia : currentMediaList) {
                if (!requestMediaIds.contains(currentMedia.getId())) {
                    // Xóa ảnh trên Cloudinary
                    String publicId = extractPublicId(currentMedia.getUrl());
                    if (publicId != null) {
                        cloudinaryService.deleteFile(publicId);
                    }
                    // Xóa media khỏi database
                    advertisementMediaService.deleteMedia(currentMedia.getId());
                }
            }

            // Duyệt qua danh sách media trong request để cập nhật hoặc thêm mới
            for (AdvertisementMediaUpdateRequest_V2 mediaRequest : request.getAdvertisementMedia()) {
                if (mediaRequest.getId() != null) {
                    // Media đã tồn tại, cập nhật thông tin
                    advertisementMediaService.updateMedia_V2(mediaRequest.getId(), mediaRequest);
                } else {
                    // Media mới
                    AdvertisementMedia newMedia = mainAdvertisementMapper.toAdvertisementMedia(mediaRequest);
                    newMedia.setAdvertisement(advertisement); // Gán quan hệ với Advertisement
                    advertisementMediaService.createMedia(newMedia);
                }
            }
        }

        // Lưu đối tượng đã chỉnh sửa
        try {
            advertisement = mainAdvertisementRepository.save(advertisement);
            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
        } catch (Exception e) {
            log.error("Error updating advertisement with ID {}: {}", advertisementId, e.getMessage());
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
        }
    }



    private String extractPublicId(String url) {
        if (url == null || !url.contains("/")) {
            return null;
        }
        try {
            // Lấy phần sau cùng của URL giữa dấu `/` và `.`
            int lastSlashIndex = url.lastIndexOf("/");
            int dotIndex = url.lastIndexOf(".");
            if (lastSlashIndex != -1 && dotIndex != -1 && lastSlashIndex < dotIndex) {
                return url.substring(lastSlashIndex + 1, dotIndex);
            }
            return null; // Nếu không phù hợp, trả về null
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_MEDIA_URL);
        }
    }






    @Transactional
    public void deleteAdvertisement(Integer advertisementId) {
        if (!mainAdvertisementRepository.existsById(advertisementId)) {
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
        }
        mainAdvertisementRepository.deleteById(advertisementId);
    }

    @Transactional
    public List<MainAdvertisementResponse> getAdvertisementsByServiceId(Integer serviceId) {
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementServiceId(serviceId);

        if (advertisements.isEmpty()) {
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
        }

        return advertisements.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MainAdvertisementResponse> getAdvertisementsByServiceName(String serviceName) {
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementServiceNameAndStatus(serviceName, "Active");

        if (advertisements.isEmpty()) {
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
        }

        return advertisements.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MainAdvertisementResponse> getTop5FoodAdvertisements() {
        // Chỉ lấy 5 kết quả từ repository
        Pageable topFive = PageRequest.of(0, 5);
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop5FoodAdvertisements(topFive);

        // Map các kết quả sang DTO response
        return results.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

    // Phương thức để tăng số lượt xem
    @Transactional
    public void increaseViews(Integer advertisementId) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        // Tăng số lượt xem
        advertisement.setViews(advertisement.getViews() + 1);
        mainAdvertisementRepository.save(advertisement);
    }

    // Phương thức để lấy Top 5 quán ăn tốt nhất
    @Transactional
    public List<MainAdvertisementResponse> getTop5BestAdvertisements() {
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop5BestAdvertisements();
        return results.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }


    // Phương thức để lấy Top 5 quán ăn tốt nhất
//    @Transactional
//    public List<MainAdvertisementTopResponse> getTop5BestAdvertisements_V2() {
//        List<MainAdvertisement> results = mainAdvertisementRepository.findTop3BestAdvertisements_V2();
//        return results.stream()
//                .map(mainAdvertisementMapper::toMainAdvertisementTopResponse)
//                .collect(Collectors.toList());
//    }


    @Transactional
    public List<MainAdvertisementTopResponse> getTop3BestAdvertisements_V2(Integer categoryId) {
        // Lấy danh sách quảng cáo tốt nhất
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop3BestAdvertisementsByCategory(categoryId);

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return results.stream()
                .map(advertisement -> {
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementTopResponse response = mainAdvertisementMapper.toMainAdvertisementTopResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }

    // Phương thức để lấy Top 5 quán ăn nổi bật
    @Transactional
    public List<MainAdvertisementResponse> getTop5PopularAdvertisements() {
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop5PopularAdvertisements();
        return results.stream()
                .map(mainAdvertisementMapper::toMainAdvertisementResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MainAdvertisementTopResponse> getTop5PopularAdvertisements_V2(Integer categoryId) {
        // Lấy danh sách quảng cáo phổ biến
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop5PopularAdvertisementsByCategory(categoryId);

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return results.stream()
                .map(advertisement -> {
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementTopResponse response = mainAdvertisementMapper.toMainAdvertisementTopResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }


//    @Transactional
//    public List<MainAdvertisementMiniResponse> getAdvertisementsByServiceId_V2(Integer serviceId) {
//        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementServiceIdAndStatus(serviceId, "Active");
//
//        if (advertisements.isEmpty()) {
//            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
//        }
//
//        return advertisements.stream()
//                .map(mainAdvertisementMapper::toMainAdvertisementMiniResponse)
//                .collect(Collectors.toList());
//    }

    @Transactional
    public List<MainAdvertisementMiniResponse> getAdvertisementsByServiceId_V2(Integer serviceId) {
        // Lấy danh sách quảng cáo theo serviceId và trạng thái "Active"
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementServiceIdAndStatus(serviceId, "Active");

        // Nếu không có quảng cáo nào thì ném ngoại lệ
        if (advertisements.isEmpty()) {
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
        }

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return advertisements.stream()
                .map(advertisement -> {
                    // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementMiniResponse response = mainAdvertisementMapper.toMainAdvertisementMiniResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public List<MainAdvertisementResponse> getAdvertisementsByServiceName_V2(String serviceName) {
        // Lấy danh sách quảng cáo theo tên dịch vụ và trạng thái "Active"
        List<MainAdvertisement> advertisements = mainAdvertisementRepository.findByAdvertisementServiceNameAndStatus(serviceName, "Active");

        // Nếu không có quảng cáo nào thì ném ngoại lệ
        if (advertisements.isEmpty()) {
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND);
        }

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return advertisements.stream()
                .map(advertisement -> {
                    // Lấy số lượng đánh giá và đánh giá trung bình cho quảng cáo
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementResponse response = mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }


    @Transactional
    public Integer incrementLikes(Integer advertisementId) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new EntityNotFoundException("Advertisement not found"));

        advertisement.setLikes(advertisement.getLikes() + 1);
        mainAdvertisementRepository.save(advertisement);

        return advertisement.getLikes(); // Trả về số lượt thích hiện tại
    }

    @Transactional
    public Integer increaseClicks(Integer advertisementId) {
        // Tìm quảng cáo bằng id
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        // Tăng số lượt click
        advertisement.setClicks(advertisement.getClicks() + 1);

        // Cập nhật lại quảng cáo
        mainAdvertisementRepository.save(advertisement);
        return advertisement.getClicks(); // Trả về số lượt click hiện tại
    }

    @Transactional
    public List<MainAdvertisementTopResponse> getTop5PopularAdvertisementsByCategoryName(String categoryName) {

        // Lấy danh sách quảng cáo phổ biến
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop5PopularAdvertisementsByCategoryName(categoryName);

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return results.stream()
                .map(advertisement -> {
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementTopResponse response = mainAdvertisementMapper.toMainAdvertisementTopResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public List<MainAdvertisementTopResponse> getTop3BestAdvertisementsByCategoryName(String categoryName) {
        // Lấy danh sách quảng cáo tốt nhất
        List<MainAdvertisement> results = mainAdvertisementRepository.findTop3BestAdvertisementsByCategoryName(categoryName);

        // Chuyển đổi và thiết lập reviewCount, averageRating
        return results.stream()
                .map(advertisement -> {
                    Long reviewCount = reviewRepository.countByAdvertisementId(advertisement.getAdvertisementId());
                    BigDecimal averageRating = reviewRepository.findAverageRatingByAdvertisementId(advertisement.getAdvertisementId());

                    // Làm tròn averageRating đến 1 chữ số thập phân, nếu null thì sử dụng 0
                    BigDecimal roundedAverageRating = (averageRating != null)
                            ? averageRating.setScale(1, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;

                    // Sử dụng mapper để chuyển đổi
                    MainAdvertisementTopResponse response = mainAdvertisementMapper.toMainAdvertisementTopResponse(advertisement);
                    response.setAverageRating(roundedAverageRating);
                    response.setReviewCount(reviewCount.intValue());

                    return response;
                })
                .collect(Collectors.toList());
    }

//    @Transactional
//    public MainAdvertisementResponse updateAdvertisementStatus(Integer advertisementId, MainAdvertisement.AdStatus newStatus) {
//        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
//                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));
//
//        advertisement.setAdStatus(newStatus); // Cập nhật trạng thái quảng cáo
//
//        try {
//            advertisement = mainAdvertisementRepository.save(advertisement);
//
//            bannerService.updateBannerStatusWithAd(advertisement.getAdvertisementId(), newStatus.equals(MainAdvertisement.AdStatus.Active));
//
//            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
//        } catch (Exception e) {
//            log.error("Error updating advertisement status", e);
//            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
//        }
//    }

    @Transactional
    public MainAdvertisementResponse updateAdvertisementStatus(Integer advertisementId, MainAdvertisement.AdStatus newStatus) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new AppException(ErrorCode.MAIN_ADVERTISEMENT_NOT_FOUND));

        advertisement.setAdStatus(newStatus); // Cập nhật trạng thái quảng cáo

        try {
            advertisement = mainAdvertisementRepository.save(advertisement);

            // Kiểm tra nếu banner tồn tại, thì mới cập nhật trạng thái của nó
            bannerService.updateBannerStatusIfExists(advertisement.getAdvertisementId(), newStatus.equals(MainAdvertisement.AdStatus.Active));

            return mainAdvertisementMapper.toMainAdvertisementResponse(advertisement);
        } catch (Exception e) {
            log.error("Error updating advertisement status", e);
            throw new AppException(ErrorCode.MAIN_ADVERTISEMENT_UPDATE_FAILED);
        }
    }



    private Double getActiveAdvertisementChangeRate(int year, int month) {
        Long currentMonthActiveAds = getTotalActiveAdvertisementsByMonth(year, month, MainAdvertisement.AdStatus.Active);
        Long previousMonthActiveAds = getTotalActiveAdvertisementsByMonth(
                month == 1 ? year - 1 : year,
                month == 1 ? 12 : month - 1,
                MainAdvertisement.AdStatus.Active
        );

        // Nếu không có quảng cáo trong tháng hiện tại
        if (currentMonthActiveAds == 0) return 0.0;

        // Nếu không có quảng cáo trong tháng trước
        if (previousMonthActiveAds == 0) return 100.0;

        // Tính tỷ lệ chênh lệch phần trăm
        double rate = ((double) currentMonthActiveAds - previousMonthActiveAds) / previousMonthActiveAds * 100;

        // Làm tròn 2 chữ số thập phân
        return Math.round(rate * 100.0) / 100.0;
    }

    public MonthlyAdvertisementStatsResponse getMonthlyAdvertisementStats(int year, int month) {
        Long totalActiveAdvertisements = getTotalActiveAdvertisementsByMonth(year, month, MainAdvertisement.AdStatus.Active);
        Double percentageChange = getActiveAdvertisementChangeRate(year, month);
        return new MonthlyAdvertisementStatsResponse(totalActiveAdvertisements, percentageChange);
    }

    private Long getTotalActiveAdvertisementsByMonth(int year, int month, MainAdvertisement.AdStatus adStatus) {
        LocalDateTime startDate = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endDate = LocalDate.of(year, month, startDate.toLocalDate().lengthOfMonth()).atTime(23, 59, 59);
        return mainAdvertisementRepository.findActiveAdsBetweenDates(adStatus, startDate, endDate);
    }

    @Transactional
    public Integer incrementSaved(Integer advertisementId) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new IllegalArgumentException("Advertisement not found"));
        advertisement.setSaved(advertisement.getSaved() + 1);
        mainAdvertisementRepository.save(advertisement);
        return advertisement.getSaved();
    }

    @Transactional
    public Integer incrementShared(Integer advertisementId) {
        MainAdvertisement advertisement = mainAdvertisementRepository.findById(advertisementId)
                .orElseThrow(() -> new IllegalArgumentException("Advertisement not found"));
        advertisement.setShared(advertisement.getShared() + 1);
        mainAdvertisementRepository.save(advertisement);
        return advertisement.getShared();
    }

    // Phương thức trả về số lượng quảng cáo đang chạy trong tháng hiện tại
    @Transactional
    public long getActiveAdvertisementsForCurrentMonth() {
        LocalDate currentDate = LocalDate.now();
        LocalDate startOfMonth = currentDate.withDayOfMonth(1); // Ngày đầu tiên của tháng hiện tại
        LocalDate endOfMonth = currentDate.withDayOfMonth(currentDate.lengthOfMonth()); // Ngày cuối cùng của tháng hiện tại

        // Chuyển đổi startOfMonth và endOfMonth thành LocalDateTime
        LocalDateTime startOfMonthDateTime = startOfMonth.atStartOfDay(); // Chuyển thành LocalDateTime lúc 00:00
        LocalDateTime endOfMonthDateTime = endOfMonth.atTime(23, 59, 59, 999999999); // Lúc 23:59:59.999999999

        return mainAdvertisementRepository.countActiveAdvertisementsInMonth(startOfMonthDateTime, endOfMonthDateTime);
    }

    // Phương thức trả về số lượng quảng cáo đang chạy cho tất cả các tháng trong năm hiện tại
    @Transactional
    public List<MonthlyActiveAdvertisementStatsResponse> getActiveAdvertisementsForAllMonths_OLD() {
        // Lấy năm hiện tại
        Integer currentYear = java.time.LocalDateTime.now().getYear();

        // Tạo danh sách kết quả cho từng tháng trong năm hiện tại
        List<MonthlyActiveAdvertisementStatsResponse> result = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            // Xác định ngày đầu tháng và cuối tháng
            LocalDate firstDayOfMonth = LocalDate.of(currentYear, month, 1);
            LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

            // Chuyển đổi ngày thành LocalDateTime
            LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
            LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59, 999999999);

            // Lấy số lượng quảng cáo đang hoạt động trong tháng
            Long activeAdsCount = mainAdvertisementRepository.countActiveAdvertisementsInMonth(startOfMonth, endOfMonth);

            // Tạo đối tượng MonthlyActiveAdvertisementStatsResponse và thêm vào danh sách kết quả
            MonthlyActiveAdvertisementStatsResponse response = MonthlyActiveAdvertisementStatsResponse.builder()
                    .activeAdvertisementsCount(activeAdsCount)
                    .month(month)
                    .year(currentYear)
                    .build();

            result.add(response);
        }

        return result;
    }

    @Transactional
    public List<MonthlyActiveAdvertisementStatsResponse> getActiveAdvertisementsForAllMonths() {
        // Lấy năm hiện tại và năm trước
        Integer currentYear = java.time.LocalDateTime.now().getYear();
        Integer previousYear = currentYear - 1;

        // Tạo danh sách kết quả cho từng tháng trong cả năm hiện tại và năm trước
        List<MonthlyActiveAdvertisementStatsResponse> result = new ArrayList<>();

        // Lặp qua năm trước và năm hiện tại
        for (Integer year : List.of(previousYear, currentYear)) {
            for (int month = 1; month <= 12; month++) {
                // Xác định ngày đầu tháng và cuối tháng
                LocalDate firstDayOfMonth = LocalDate.of(year, month, 1);
                LocalDate lastDayOfMonth = firstDayOfMonth.withDayOfMonth(firstDayOfMonth.lengthOfMonth());

                // Chuyển đổi ngày thành LocalDateTime
                LocalDateTime startOfMonth = firstDayOfMonth.atStartOfDay();
                LocalDateTime endOfMonth = lastDayOfMonth.atTime(23, 59, 59, 999999999);

                // Lấy số lượng quảng cáo đang hoạt động trong tháng
                Long activeAdsCount = mainAdvertisementRepository.countActiveAdvertisementsInMonth(startOfMonth, endOfMonth);

                // Tạo đối tượng MonthlyActiveAdvertisementStatsResponse và thêm vào danh sách kết quả
                MonthlyActiveAdvertisementStatsResponse response = MonthlyActiveAdvertisementStatsResponse.builder()
                        .activeAdvertisementsCount(activeAdsCount)
                        .month(month)
                        .year(year)
                        .build();

                result.add(response);
            }
        }

        return result;
    }


}
