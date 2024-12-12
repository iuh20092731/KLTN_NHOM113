package com.apartmentservices.services.impl;

import com.apartmentservices.dto.request.AdvertisementMediaUpdateReq;
import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest;
import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest_V2;
import com.apartmentservices.dto.response.AdvertisementMediaResponse;
import com.apartmentservices.mapper.AdvertisementMediaMapper;
import com.apartmentservices.models.AdvertisementMedia;
import com.apartmentservices.repositories.AdvertisementMediaRepository;
import com.apartmentservices.services.AdvertisementMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdvertisementMediaServiceImpl implements AdvertisementMediaService {

    private final AdvertisementMediaRepository advertisementMediaRepository;
    private final AdvertisementMediaMapper advertisementMediaMapper;

    @Override
    public AdvertisementMedia createMedia(AdvertisementMedia media) {
        return advertisementMediaRepository.save(media);
    }

    @Override
    public List<AdvertisementMedia> getAllMediaByAdvertisement(Integer advertisementId) {
        return advertisementMediaRepository.findByAdvertisement_AdvertisementId(advertisementId);
    }

    @Override
    public List<AdvertisementMedia> getMediaByAdvertisementAndType(Integer advertisementId, AdvertisementMedia.MediaType type) {
        return advertisementMediaRepository.findByAdvertisement_AdvertisementIdAndType(advertisementId, type);
    }

    @Override
    public AdvertisementMedia updateMediaByAdvertisementId(Integer advertisementId, AdvertisementMediaUpdateRequest updatedMediaRequest) {
        List<AdvertisementMedia> mediaList = advertisementMediaRepository.findByAdvertisement_AdvertisementId(advertisementId);
        if (mediaList.isEmpty()) {
            return null;
        }

        AdvertisementMedia media = mediaList.get(0); // Giả sử lấy 1 media đầu tiên (có thể cần điều chỉnh nếu có nhiều hơn 1)
        advertisementMediaMapper.updateAdvertisementMediaFromDto(media, updatedMediaRequest);

        return advertisementMediaRepository.save(media);
    }

    @Override
    public AdvertisementMediaResponse updateMedia(Integer mediaId, AdvertisementMediaUpdateReq updatedMedia) {
        AdvertisementMedia media = advertisementMediaRepository.findById(mediaId).orElse(null);
        if (media != null) {
            // Kiểm tra từng trường và chỉ cập nhật nếu trường đó có giá trị
            if (updatedMedia.getName() != null) {
                media.setName(updatedMedia.getName());
            }
            if (updatedMedia.getContent() != null) {
                media.setContent(updatedMedia.getContent());
            }
            if (updatedMedia.getUrl() != null) {
                media.setUrl(updatedMedia.getUrl());
            }
            if (updatedMedia.getType() != null) {
                media.setType(updatedMedia.getType());
            }
            AdvertisementMedia updatedEntity = advertisementMediaRepository.save(media);
            return advertisementMediaMapper.toAdvertisementMediaResponse(updatedEntity);
        }
        return null; // Handle not found case
    }

    @Override
    public AdvertisementMediaResponse updateMedia_V2(Integer mediaId, AdvertisementMediaUpdateRequest_V2 updatedMedia) {
        AdvertisementMedia media = advertisementMediaRepository.findById(mediaId).orElse(null);
        if (media != null) {
            // Kiểm tra từng trường và chỉ cập nhật nếu trường đó có giá trị
            if (updatedMedia.getName() != null) {
                media.setName(updatedMedia.getName());
            }
            if (updatedMedia.getContent() != null) {
                media.setContent(updatedMedia.getContent());
            }
            if (updatedMedia.getUrl() != null) {
                media.setUrl(updatedMedia.getUrl());
            }
            if (updatedMedia.getType() != null) {
                media.setType(updatedMedia.getType());
            }
            AdvertisementMedia updatedEntity = advertisementMediaRepository.save(media);
            return advertisementMediaMapper.toAdvertisementMediaResponse(updatedEntity);
        }
        return null; // Handle not found case
    }

    @Override
    public void deleteMedia(Integer mediaId) {
        advertisementMediaRepository.deleteById(mediaId);
    }

    @Override
    public List<AdvertisementMediaResponse> getTop5Banners() {
        return advertisementMediaRepository.findTop5ByTypeOrderByCreatedDateDesc(AdvertisementMedia.MediaType.BANNER).stream()
                .map(advertisementMediaMapper::toAdvertisementMediaResponse)
                .collect(Collectors.toList());
    }
}
