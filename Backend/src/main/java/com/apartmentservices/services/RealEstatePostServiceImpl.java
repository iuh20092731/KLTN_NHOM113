package com.apartmentservices.services;

import com.apartmentservices.dto.request.RealEstatePostCreationRequest;
import com.apartmentservices.dto.request.RealEstatePostUpdateRequest;
import com.apartmentservices.dto.response.PaginatedResponse;
import com.apartmentservices.dto.response.PostViewResponse;
import com.apartmentservices.dto.response.RealEstatePostResponse;
import com.apartmentservices.mapper.RealEstatePostMapper;
import com.apartmentservices.models.RealEstatePost;
import com.apartmentservices.repositories.RealEstatePostRepository;
import com.apartmentservices.services.RealEstatePostService;
import com.apartmentservices.exception.AppException;
import com.apartmentservices.exception.ErrorCode;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RealEstatePostServiceImpl implements RealEstatePostService {

    private final RealEstatePostRepository realEstatePostRepository;
    private final RealEstatePostMapper realEstatePostMapper;

    @Override
    public RealEstatePostResponse createPost(RealEstatePostCreationRequest request) {
        RealEstatePost post = realEstatePostMapper.toRealEstatePost(request);
        post = realEstatePostRepository.save(post);
        return realEstatePostMapper.toRealEstatePostResponse(post);
    }

    @Override
    public List<RealEstatePostResponse> getAllPosts() {
        return realEstatePostRepository.findAll()
                .stream()
                .map(realEstatePostMapper::toRealEstatePostResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RealEstatePostResponse getPostById(Integer postId) {
        RealEstatePost post = realEstatePostRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        return realEstatePostMapper.toRealEstatePostResponseForDetail(post);
    }

    @Override
    public RealEstatePostResponse updatePost(Integer postId, RealEstatePostUpdateRequest request) {
        RealEstatePost existingPost = realEstatePostRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));
        realEstatePostMapper.updateRealEstatePost(existingPost, request);
        existingPost = realEstatePostRepository.save(existingPost);
        return realEstatePostMapper.toRealEstatePostResponse(existingPost);
    }

    @Override
    public void deletePost(Integer postId) {
        if (!realEstatePostRepository.existsById(postId)) {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }
        realEstatePostRepository.deleteById(postId);
    }

    @Override
    public List<RealEstatePostResponse> getRecentPosts(int limit) {
        return realEstatePostRepository.findTopNByOrderByCreatedAtAsc(limit)
                .stream()
                .map(realEstatePostMapper::toRealEstatePostResponse)
                .collect(Collectors.toList());
    }

//    @Override
//    public List<RealEstatePostResponse> getPaginatedPosts(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        List<RealEstatePost> posts = realEstatePostRepository.findAll(pageable).getContent();
//
//        return posts.stream()
//                .map(post -> {
//                    RealEstatePostResponse response = realEstatePostMapper.toRealEstatePostResponse(post);
//                    response.setTimeAgo(calculateTimeAgo(post.getCreatedAt())); // Giả sử bạn đã thêm trường này vào DTO
//                    return response;
//                })
//                .collect(Collectors.toList());
//    }

    @Override
    public PaginatedResponse getPaginatedPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")); // Sắp xếp theo createdAt
        List<RealEstatePost> posts = realEstatePostRepository.findAll(pageable).getContent();
        long totalPosts = realEstatePostRepository.count(); // Đếm tổng số bài đăng

        List<RealEstatePostResponse> responses = posts.stream()
                .map(post -> {
                    RealEstatePostResponse response = realEstatePostMapper.toRealEstatePostResponse(post);
                    response.setTimeAgo(calculateTimeAgo(post.getCreatedAt()));
                    return response;
                })
                .collect(Collectors.toList());

        // Tạo đối tượng PaginatedResponse
        return new PaginatedResponse(totalPosts, responses);
    }


    public String calculateTimeAgo(LocalDateTime createdAt) {
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(createdAt, now);
        long hours = ChronoUnit.HOURS.between(createdAt, now);
        long days = ChronoUnit.DAYS.between(createdAt, now);

        if (minutes < 60) {
            return minutes + " phút trước";
        } else if (hours < 24) {
            return hours + " giờ trước";
        } else {
            return days + " ngày trước";
        }
    }

    @Override
    public List<PostViewResponse> increaseViews(List<Integer> postIds) {
        List<RealEstatePost> posts = realEstatePostRepository.findAllById(postIds);
        List<PostViewResponse> responseList = new ArrayList<>();

        for (RealEstatePost post : posts) {
            post.setViews(post.getViews() + 1);
            responseList.add(new PostViewResponse(post.getPostId(), post.getViews()));
        }
        realEstatePostRepository.saveAll(posts);
        return responseList;
    }

}
