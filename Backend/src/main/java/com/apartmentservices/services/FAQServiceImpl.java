package com.apartmentservices.services;

import java.util.List;
import java.util.stream.Collectors;

import com.apartmentservices.dto.request.FAQCreationRequest;
import com.apartmentservices.dto.request.FAQUpdateRequest;
import com.apartmentservices.exception.ResourceNotFoundException;
import com.apartmentservices.mapper.FAQMapper;
import com.apartmentservices.models.FAQ;
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

    @Override
    public FAQResponse createFAQ(FAQCreationRequest request) {
        // Ánh xạ từ DTO sang entity
        FAQ faq = faqMapper.toFAQ(request);

        // Lưu vào cơ sở dữ liệu
        FAQ savedFAQ = faqRepository.save(faq);

        // Ánh xạ từ entity sang response DTO
        return faqMapper.toFAQResponse(savedFAQ);
    }

    @Override
    public FAQResponse updateFAQ(Integer faqId, FAQUpdateRequest request) {
        // Tìm FAQ theo ID, nếu không có sẽ ném lỗi
        FAQ existingFAQ = faqRepository.findById(faqId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FAQ_NOT_FOUND));

        // Ánh xạ từ request DTO sang entity
        faqMapper.updateFAQFromRequest(request, existingFAQ);

        // Lưu thay đổi vào cơ sở dữ liệu
        FAQ updatedFAQ = faqRepository.save(existingFAQ);

        // Ánh xạ từ entity sang response DTO
        return faqMapper.toFAQResponse(updatedFAQ);
    }
    @Override
    public void deleteFAQ(Integer faqId) {
        // Kiểm tra xem FAQ có tồn tại không, nếu không ném lỗi
        FAQ existingFAQ = faqRepository.findById(faqId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FAQ_NOT_FOUND));

        // Xóa FAQ khỏi cơ sở dữ liệu
        faqRepository.delete(existingFAQ);
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
