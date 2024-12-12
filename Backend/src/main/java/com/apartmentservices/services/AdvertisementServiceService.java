package com.apartmentservices.services;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.apartmentservices.dto.request.v2.AdvertisementServiceUpdateRequest_V2;
import com.apartmentservices.dto.request.v2.ServiceMediaUpdateRequest_V2;
import com.apartmentservices.dto.response.AdvertisementServiceMediaResponse;
import com.apartmentservices.models.AdvertisementServiceMedia;
import com.apartmentservices.repositories.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentservices.dto.request.AdvertisementServiceCreationRequest;
import com.apartmentservices.dto.request.AdvertisementServiceUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementServiceResponse;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.models.Category;
import com.apartmentservices.repositories.AdvertisementServiceRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdvertisementServiceService {

    AdvertisementServiceRepository advertisementServiceRepository;
    CategoryRepository categoryRepository;

    CloudinaryService cloudinaryService;

    @Transactional
    public AdvertisementServiceResponse createAdvertisementService(AdvertisementServiceCreationRequest request) {
        // Kiểm tra và lấy Category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Tạo đối tượng AdvertisementServiceMedia nếu imageUrl được cung cấp
        List<AdvertisementServiceMedia> mediaList = new ArrayList<>();
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            AdvertisementServiceMedia media = AdvertisementServiceMedia.builder()
                    .advertisementService(null) // Liên kết sẽ được tự động cập nhật sau khi lưu
                    .mediaType(AdvertisementServiceMedia.MediaType.IMAGE)
                    .mediaUrl(request.getImageUrl())
                    .build();
            mediaList.add(media);
        }

        // Tạo đối tượng AdvertisementService
        AdvertisementService advertisementService = AdvertisementService.builder()
                .serviceName(request.getServiceName())
                .description(request.getDescription())
                .deliveryAvailable(request.getDeliveryAvailable())
                .category(category)
                .isActive(request.getIsActive())
                .serviceNameNoDiacritics(removeDiacritics(request.getServiceName()))
                .advertisementMedia(mediaList) // Gắn danh sách media
                .build();

        // Liên kết ngược từ media về service
        for (AdvertisementServiceMedia media : mediaList) {
            media.setAdvertisementService(advertisementService);
        }

        // Lưu và xử lý ngoại lệ
        try {
            AdvertisementService savedService = advertisementServiceRepository.save(advertisementService);
            return toResponse(savedService);
        } catch (Exception e) {
            log.error("Error creating AdvertisementService", e);
            throw new AppException(ErrorCode.ADVERTISEMENT_SERVICE_CREATION_FAILED);
        }
    }


    // Hàm xử lý bỏ dấu
    private String removeDiacritics(String input) {
        if (input == null) return null;
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("").replaceAll("[^\\p{ASCII}]", "").replaceAll("\\s+", "").toLowerCase();
    }

    public AdvertisementServiceResponse getAdvertisementService(Integer serviceId) {
        AdvertisementService advertisementService = advertisementServiceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));

        return toResponse(advertisementService);
    }

    public List<AdvertisementServiceResponse> getAllAdvertisementServices() {
        return advertisementServiceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdvertisementServiceResponse updateAdvertisementService(Integer serviceId, AdvertisementServiceUpdateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return advertisementServiceRepository.findById(serviceId)
                .map(advertisementService -> {
                    advertisementService.setServiceName(request.getServiceName());
                    advertisementService.setDescription(request.getDescription());
                    advertisementService.setDeliveryAvailable(request.getDeliveryAvailable());
                    advertisementService.setCategory(category);
                    return toResponse(advertisementServiceRepository.save(advertisementService));
                })
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));
    }

    @Transactional
    public AdvertisementServiceResponse updateAdvertisementService_V2(Integer serviceId, AdvertisementServiceUpdateRequest_V2 request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        return advertisementServiceRepository.findById(serviceId)
                .map(advertisementService -> {
                    advertisementService.setServiceName(request.getServiceName());
                    advertisementService.setDescription(request.getDescription());
                    advertisementService.setDeliveryAvailable(request.getDeliveryAvailable());
                    advertisementService.setCategory(category);
                    advertisementService.setIsActive(request.getIsActive());

                    // Xử lý cập nhật danh sách media
                    if (request.getAdvertisementMedia() != null) {
                        List<Integer> existingMediaIds = advertisementService.getAdvertisementMedia().stream()
                                .map(AdvertisementServiceMedia::getMediaId)
                                .toList();

                        // Xóa các media không tồn tại trong request
                        advertisementService.getAdvertisementMedia().removeIf(existingMedia ->
                                request.getAdvertisementMedia().stream().noneMatch(newMedia ->
                                        Objects.equals(newMedia.getMediaId(), existingMedia.getMediaId()))
                        );

                        // Cập nhật hoặc thêm mới media
                        for (ServiceMediaUpdateRequest_V2 mediaRequest : request.getAdvertisementMedia()) {
                            if (mediaRequest.getMediaId() != null && existingMediaIds.contains(mediaRequest.getMediaId())) {
                                // Media đã tồn tại, cập nhật thông tin
                                AdvertisementServiceMedia existingMedia = advertisementService.getAdvertisementMedia().stream()
                                        .filter(m -> Objects.equals(m.getMediaId(), mediaRequest.getMediaId()))
                                        .findFirst()
                                        .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
                                existingMedia.setMediaType(mediaRequest.getMediaType());
                                existingMedia.setMediaUrl(mediaRequest.getMediaUrl());
                            } else {
                                // Media mới
                                AdvertisementServiceMedia newMedia = AdvertisementServiceMedia.builder()
                                        .advertisementService(advertisementService)
                                        .mediaType(mediaRequest.getMediaType())
                                        .mediaUrl(mediaRequest.getMediaUrl())
                                        .build();
                                advertisementService.getAdvertisementMedia().add(newMedia);
                            }
                        }
                    }

                    return toResponse(advertisementServiceRepository.save(advertisementService));
                })
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));
    }


//    @Transactional
//    public void deleteAdvertisementService(Integer serviceId) {
//        if (!advertisementServiceRepository.existsById(serviceId)) {
//            throw new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND);
//        }
//        try {
//            advertisementServiceRepository.deleteById(serviceId);
//        } catch (Exception e) {
//            log.error("Error deleting AdvertisementService", e);
//            throw new AppException(ErrorCode.ADVERTISEMENT_SERVICE_DELETION_FAILED);
//        }
//    }

    @Transactional
    public void deleteAdvertisementService(Integer serviceId) {
        // Kiểm tra sự tồn tại của AdvertisementService
        AdvertisementService advertisementService = advertisementServiceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));

        // Xoá các hình ảnh liên quan trong AdvertisementServiceMedia
        if (advertisementService.getAdvertisementMedia() != null && !advertisementService.getAdvertisementMedia().isEmpty()) {
            for (AdvertisementServiceMedia media : advertisementService.getAdvertisementMedia()) {
                if (media.getMediaUrl() != null) {
                    String publicId = extractPublicId(media.getMediaUrl());
                    if (publicId != null) {
                        try {
                            String result = cloudinaryService.deleteFile(publicId);
                            log.info("Deleted media on Cloudinary: {}", result);
                        } catch (Exception e) {
                            log.error("Error deleting media on Cloudinary: {}", e.getMessage());
                            throw new AppException(ErrorCode.MEDIA_DELETION_FAILED);
                        }
                    } else {
                        log.warn("Could not extract publicId from mediaUrl: {}", media.getMediaUrl());
                    }
                }
            }
        }

        // Sau khi xóa ảnh, xóa AdvertisementService
        try {
            advertisementServiceRepository.deleteById(serviceId);
        } catch (Exception e) {
            log.error("Error deleting AdvertisementService", e);
            throw new AppException(ErrorCode.ADVERTISEMENT_SERVICE_DELETION_FAILED);
        }
    }

    private String extractPublicId(String url) {
        if (url == null || !url.contains("/")) {
            return null;
        }
        try {
            int lastSlashIndex = url.lastIndexOf("/");
            int dotIndex = url.lastIndexOf(".");
            if (lastSlashIndex != -1 && dotIndex != -1 && lastSlashIndex < dotIndex) {
                return url.substring(lastSlashIndex + 1, dotIndex);
            }
            return null;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_MEDIA_URL);
        }
    }


    private AdvertisementServiceResponse toResponse(AdvertisementService advertisementService) {
        return AdvertisementServiceResponse.builder()
                .serviceId(advertisementService.getServiceId())
                .serviceName(advertisementService.getServiceName())
                .description(advertisementService.getDescription())
                .deliveryAvailable(advertisementService.getDeliveryAvailable())
                .categoryId(advertisementService.getCategory().getCategoryId())
                .serviceNameNoDiacritics(advertisementService.getServiceNameNoDiacritics())
                .categoryNameNoDiacritics(advertisementService.getCategory().getCategoryNameNoDiacritics())
                .isActive(advertisementService.getIsActive())
                .categoryName(advertisementService.getCategory().getCategoryName())
                .media(advertisementService.getAdvertisementMedia().stream()
                        .map(media -> AdvertisementServiceMediaResponse.builder()
                                .mediaId(media.getMediaId())
                                .mediaUrl(media.getMediaUrl())
                                .serviceId(advertisementService.getServiceId())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    private AdvertisementServiceResponse toResponse3(AdvertisementService advertisementService) {
        List<AdvertisementServiceMediaResponse> mediaResponses = advertisementService.getAdvertisementMedia().stream()
                .map(media -> AdvertisementServiceMediaResponse.builder()
                        .mediaId(media.getMediaId())
                        .mediaUrl(media.getMediaUrl())
                        .serviceId(advertisementService.getServiceId())
                        .build())
                .collect(Collectors.toList());

        return AdvertisementServiceResponse.builder()
                .serviceId(advertisementService.getServiceId())
                .serviceName(advertisementService.getServiceName())
                .description(advertisementService.getDescription())
                .deliveryAvailable(advertisementService.getDeliveryAvailable())
                .categoryId(advertisementService.getCategory().getCategoryId()) // Chỉ trả về categoryId
                .media(mediaResponses) // Trả về danh sách media responses
                .build();
    }


    public List<AdvertisementServiceResponse> getAdvertisementServicesByCategoryName(String categoryName) {
        return advertisementServiceRepository.findByCategory_CategoryNameContainingIgnoreCase(categoryName).stream()
                .map(this::toResponse3)
                .collect(Collectors.toList());
    }

    public AdvertisementServiceResponse getAdvertisementServiceByServiceNameNoDiacritics(String serviceNameNoDiacritics) {
        AdvertisementService advertisementService = advertisementServiceRepository.findByServiceNameNoDiacritics(serviceNameNoDiacritics)
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));

        return toResponse(advertisementService);
    }

    @Transactional
    public void updateAdvertisementServiceStatus(Integer serviceId, Boolean isActive) {
        AdvertisementService advertisementService = advertisementServiceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.ADVERTISEMENT_SERVICE_NOT_FOUND));

        advertisementService.setIsActive(isActive);
        advertisementServiceRepository.save(advertisementService);
    }

    @Transactional
    public List<AdvertisementServiceResponse> getAdvertisementServicesByCategoryId(Integer categoryId) {
        return advertisementServiceRepository.findByCategory_CategoryId(categoryId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
