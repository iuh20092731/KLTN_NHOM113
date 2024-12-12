package com.apartmentservices.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apartmentservices.dto.request.AdvertisementServiceMediaCreationRequest;
import com.apartmentservices.dto.request.AdvertisementServiceMediaUpdateRequest;
import com.apartmentservices.dto.response.AdvertisementServiceMediaResponse;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.models.AdvertisementService;
import com.apartmentservices.models.AdvertisementServiceMedia;
import com.apartmentservices.repositories.AdvertisementServiceMediaRepository;
import com.apartmentservices.repositories.AdvertisementServiceRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdvertisementServiceMediaService {

    AdvertisementServiceMediaRepository advertisementServiceMediaRepository;
    AdvertisementServiceRepository advertisementServiceRepository;

    @Transactional
    public AdvertisementServiceMediaResponse createAdvertisementServiceMedia(AdvertisementServiceMediaCreationRequest request) {
        AdvertisementService advertisementService = advertisementServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));

        AdvertisementServiceMedia media = AdvertisementServiceMedia.builder()
                .mediaUrl(request.getMediaUrl())
                .advertisementService(advertisementService) // Sử dụng đối tượng dịch vụ
                .build();

        try {
            return toResponse(advertisementServiceMediaRepository.save(media));
        } catch (Exception e) {
            log.error("Error creating AdvertisementServiceMedia", e);
            throw new AppException(ErrorCode.SERVICE_MEDIA_CREATION_FAILED);
        }
    }

    public AdvertisementServiceMediaResponse getAdvertisementServiceMedia(Integer mediaId) {
        AdvertisementServiceMedia media = advertisementServiceMediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_MEDIA_NOT_FOUND));

        return toResponse(media);
    }

    public List<AdvertisementServiceMediaResponse> getAllAdvertisementServiceMedia() {
        return advertisementServiceMediaRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdvertisementServiceMediaResponse updateAdvertisementServiceMedia(Integer mediaId, AdvertisementServiceMediaUpdateRequest request) {
        return advertisementServiceMediaRepository.findById(mediaId)
                .map(media -> {
                    media.setMediaUrl(request.getMediaUrl());
                    AdvertisementService advertisementService = advertisementServiceRepository.findById(request.getServiceId())
                            .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
                    media.setAdvertisementService(advertisementService); // Cập nhật đối tượng dịch vụ
                    return toResponse(advertisementServiceMediaRepository.save(media));
                })
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_MEDIA_NOT_FOUND));
    }

    @Transactional
    public void deleteAdvertisementServiceMedia(Integer mediaId) {
        if (!advertisementServiceMediaRepository.existsById(mediaId)) {
            throw new AppException(ErrorCode.SERVICE_MEDIA_NOT_FOUND);
        }
        try {
            advertisementServiceMediaRepository.deleteById(mediaId);
        } catch (Exception e) {
            log.error("Error deleting AdvertisementServiceMedia", e);
            throw new AppException(ErrorCode.SERVICE_MEDIA_DELETION_FAILED);
        }
    }

    private AdvertisementServiceMediaResponse toResponse(AdvertisementServiceMedia media) {
        return AdvertisementServiceMediaResponse.builder()
                .mediaId(media.getMediaId())
                .mediaUrl(media.getMediaUrl())
                .serviceId(media.getAdvertisementService().getServiceId()) // Lấy ID từ đối tượng dịch vụ
                .build();
    }
}
