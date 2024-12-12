import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { AppDispatch, RootState } from '@/redux/store'
import { getReviewsByAdvertimentId, postReview } from '@/redux/thunks/review'
import { ChevronDown, ChevronUp, Send, Star, User } from "lucide-react"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ReviewCard = ({ review, isExpanded, onToggle }: { review: any; isExpanded: boolean; onToggle: () => void }) => (
  <Card className="mb-2 mt-5">
    <CardContent className="p-4">
      <div className="flex justify-center items-center space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarFallback>
            <User className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">
              {review.user.firstName} {review.user.lastName}
            </h3>
            <div className="text-xs text-muted-foreground">
              {new Date(review.reviewDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className={`overflow-hidden h-fit}`}>
            <p className="text-sm leading-6">{review.reviewContent}</p>
          </div>
          {review.reviewContent.length > 150 && (
            <button
              onClick={onToggle}
              className="text-xs text-primary hover:underline mt-2"
            >
              {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
            </button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Reviews({ advertisementId }: { advertisementId: number }) {
  const [expandedReviews, setExpandedReviews] = useState<number[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [newReview, setNewReview] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch: AppDispatch = useDispatch()
  const reviews = useSelector((state: RootState) => state.review.reviews)
  const {userInfo, isLogin} = useSelector((state: RootState) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    dispatch(getReviewsByAdvertimentId(advertisementId))
  }, [advertisementId, dispatch])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  const toggleReviewExpansion = (reviewId: number) => {
    setExpandedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  

  const handleSubmitReview = async () => {
    if (!userInfo || !userInfo.userId) {
      console.error('User not logged in');
      return;
    }
    const reviewData = {
      advertisementId: advertisementId,
      userId: userInfo.userId,
      rating: rating,
      reviewContent: newReview
    };
    try {
      await dispatch(postReview(reviewData)).unwrap();
      dispatch(getReviewsByAdvertimentId(advertisementId));
      setNewReview('');
      setRating(0);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  }

  const totalReviews = reviews.reviews.length
  const starCounts = [
    reviews.oneStarCount,
    reviews.twoStarCount,
    reviews.threeStarCount,
    reviews.fourStarCount,
    reviews.fiveStarCount
  ]

  const displayedReviews = showAllReviews ? reviews.reviews : reviews.reviews.slice(0, 2)

  return (
    <div className="container mx-auto ">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đánh giá từ khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="text-4xl font-bold mr-4">{reviews.averageRating.toFixed(1)}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(reviews.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Dựa trên {totalReviews} đánh giá
            </div>
          </div>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center">
                <span className="w-12 text-sm font-medium whitespace-nowrap">{star} sao</span>
                <Progress
                  value={(starCounts[4 - index] / totalReviews) * 100}
                  className="h-2 flex-grow mx-4"
                />
                <span className="w-12 text-sm text-right">
                  {starCounts[4 - index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {userInfo && isLogin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="my-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
          >
            <Star className="mr-2 h-5 w-5" />
            Thêm đánh giá của bạn
          </Button>
      )}
      {displayedReviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          review={review}
          isExpanded={expandedReviews.includes(review.reviewId)}
          onToggle={() => toggleReviewExpansion(review.reviewId)}
        />
      ))}

      {reviews.reviews.length > 2 && (
        <div className="text-center">
          <div
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="flex items-center justify-center cursor-pointer mt-4"
          >
            <span className="font-semibold mr-2">
              {showAllReviews ? 'Ẩn bớt đánh giá' : 'Xem thêm đánh giá'}
            </span>
            {showAllReviews ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <Card
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
                <CardTitle className="text-2xl font-bold text-center">Thêm đánh giá của bạn</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="rating" className="text-lg font-semibold text-gray-800 mb-2 block">Đánh giá của bạn</Label>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer transition-all duration-300 ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review" className="text-lg font-semibold text-gray-800 mb-2 block">Nội dung đánh giá</Label>
                    <Textarea
                      id="review"
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end space-x-3">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300 text-base font-medium"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition duration-300 text-base font-medium flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi đánh giá
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
    </div>
  )
}
