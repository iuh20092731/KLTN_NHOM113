package com.apartmentservices.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import com.apartmentservices.exception.ResourceNotFoundException;
import com.apartmentservices.mapper.FAQMapper;
import org.springframework.stereotype.Service;

import com.apartmentservices.dto.response.FAQResponse;
import com.apartmentservices.exception.ErrorCode;
import com.apartmentservices.repositories.FAQRepository;
import com.apartmentservices.services.FAQService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FAQServiceImpl implements FAQService {

    private final FAQRepository faqRepository;
    private final FAQMapper faqMapper;

//    @Override
//    public FAQResponse createFAQ(FAQCreationRequest request) {
//        // Implement create FAQ logic
//    }

    @Override
    public List<FAQResponse> getFAQs() {
        return faqRepository.findAll().stream()
                .map(faqMapper::toFAQResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FAQResponse getFAQById(Integer faqId) {
        return faqRepository.findById(faqId)
                .map(faqMapper::toFAQResponse)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FAQ_NOT_FOUND));
    }

    @Override
    public List<FAQResponse> getFAQsByAdvertisementId(Integer advertisementId) {
        return faqRepository.findByAdvertisement_AdvertisementId(advertisementId).stream()
                .map(faqMapper::toFAQResponse)
                .collect(Collectors.toList());
    }

//    @Override
//    public FAQResponse updateFAQ(Long faqId, FAQUpdateRequest request) {
//        // Implement update FAQ logic
//    }
//
//    @Override
//    public void deleteFAQ(Long faqId) {
//        // Implement delete FAQ logic
//    }
}
