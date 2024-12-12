package com.apartmentservices.services.impl;


import com.apartmentservices.dto.request.info.SocialGroupLinkCreationRequest;
import com.apartmentservices.dto.request.info.SocialGroupLinkUpdateRequest;
import com.apartmentservices.dto.response.PaginatedResponse;

import com.apartmentservices.dto.response.info.SocialGroupLinkResponse;
import com.apartmentservices.mapper.SocialGroupLinkMapper;

import com.apartmentservices.models.info.SocialGroupLink;
import com.apartmentservices.repositories.SocialGroupLinkRepository;
import com.apartmentservices.services.CloudinaryService;
import com.apartmentservices.services.SocialGroupLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialGroupLinkServiceImpl implements SocialGroupLinkService {

    private final SocialGroupLinkRepository socialGroupLinkRepository;
    private final SocialGroupLinkMapper socialGroupLinkMapper;

    private final CloudinaryService cloudinaryService;

    @Override
    public List<SocialGroupLinkResponse> getAllLinks() {
        return socialGroupLinkRepository.findAll()
                .stream()
                .map(socialGroupLinkMapper::toSocialGroupLinkResponse)
                .collect(Collectors.toList());
    }

//    @Override
//    public SocialGroupLinkResponse createLink(SocialGroupLinkCreationRequest request) {
//        SocialGroupLink link = socialGroupLinkMapper.toSocialGroupLink(request);
//        link = socialGroupLinkRepository.save(link);
//        return socialGroupLinkMapper.toSocialGroupLinkResponse(link);
//    }

    @Override
    public SocialGroupLinkResponse createLink(SocialGroupLinkCreationRequest request) {
        // Xác định serial
        Integer newSerial;
        if (request.getSerial() != null && request.getSerial() == 0) {
            newSerial = 0; // Nếu serial là 0, giữ nguyên 0
        } else {
            // Tìm giá trị serial lớn nhất hiện tại nếu không truyền hoặc khác 0
            Integer maxSerial = socialGroupLinkRepository.findMaxSerial();
            newSerial = (maxSerial != null) ? maxSerial + 1 : 1;
        }

        // Tạo đối tượng SocialGroupLink
        SocialGroupLink link = SocialGroupLink.builder()
                .platform(request.getPlatform())
                .groupName(request.getGroupName())
                .groupLink(request.getGroupLink())
                .description(request.getDescription())
                .remark(request.getRemark())
                .isActive(request.getIsActive())
                .serial(newSerial) // Gán serial dựa trên logic
                .imageUrl(request.getImageUrl()) // Gán imageUrl từ request
                .build();

        // Lưu đối tượng vào database
        SocialGroupLink savedLink = socialGroupLinkRepository.save(link);

        // Trả về phản hồi dưới dạng DTO
        return socialGroupLinkMapper.toSocialGroupLinkResponse(savedLink);
    }


    @Override
    public SocialGroupLinkResponse getLinkById(Integer linkId) {
        SocialGroupLink link = socialGroupLinkRepository.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Link not found"));
        return socialGroupLinkMapper.toSocialGroupLinkResponse(link);
    }

    @Override
    public SocialGroupLinkResponse updateLink(Integer linkId, SocialGroupLinkUpdateRequest request) {
        SocialGroupLink existingLink = socialGroupLinkRepository.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Link not found"));
        socialGroupLinkMapper.updateSocialGroupLink(existingLink, request);
        existingLink = socialGroupLinkRepository.save(existingLink);
        return socialGroupLinkMapper.toSocialGroupLinkResponse(existingLink);
    }

    @Override
    public void deleteLink(Integer linkId) {
        // Kiểm tra sự tồn tại của SocialGroupLink
        SocialGroupLink link = socialGroupLinkRepository.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Link not found"));

        // Nếu có URL hình ảnh, xoá hình ảnh trên Cloudinary
        if (link.getImageUrl() != null) {
            String publicId = extractPublicId(link.getImageUrl());
            if (publicId != null) {
                try {
                    String result = cloudinaryService.deleteFile(publicId);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to delete image on Cloudinary");
                }
            } else {
            }
        }

        // Xoá link sau khi đã xoá hình ảnh
        try {
            socialGroupLinkRepository.deleteById(linkId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete SocialGroupLink");
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
            throw new RuntimeException("Invalid media URL");
        }
    }


}
