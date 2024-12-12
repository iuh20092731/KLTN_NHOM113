import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { postRealEstate, getRealEstateListPaginated, increaseViewRealEstate } from '../../../redux/thunks/realestate';
import { User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BanTin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const isLoggedIn = useSelector((state: RootState) => state.user.isLogin);
  const { paginatedList, status, error } = useSelector((state: RootState) => state.realEstate);
  
  const [postType, setPostType] = useState("Cần mua");
  const [description, setDescription] = useState("");
  // const [isAnonymous, setIsAnonymous] = useState(true);
  const [isAnonymous,] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewedPosts, setViewedPosts] = useState<number[]>([]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewed = localStorage.getItem("viewedPosts");
    if (viewed) {
      setViewedPosts(JSON.parse(viewed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
  }, [viewedPosts]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getRealEstateListPaginated({ 
        page: paginatedList.page, 
        size: paginatedList.size 
      })).unwrap();
    
      const postIds = result.data.map(post => Number(post.postId));
      if (postIds.length > 0) {
        dispatch(increaseViewRealEstate(postIds));
      }
    };
    fetchData();
  }, [dispatch, paginatedList.page, paginatedList.size]);

  useEffect(() => {
    if (paginatedList.page > 0 && listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [paginatedList.page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      postType,
      content: description,
      isAnonymous
    };
    
    try {
      const result = await dispatch(postRealEstate(newPost));
      if (postRealEstate.fulfilled.match(result)) {
        dispatch(getRealEstateListPaginated({ page: 0, size: paginatedList.size }));
        setDescription("");
        setShowForm(false);
        toast({
          variant: "default",
          title: "Đăng tin thành công",
          description: 'Đăng tin thành công.',
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: 'Đã xảy ra lỗi khi đăng tin. Vui lòng thử lại sau.',
          duration: 3000, 
        });
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
        duration: 5000,
      });
    }
  };

  const handleView = (postId: number) => {
    if (!viewedPosts.includes(postId)) {
      setViewedPosts([...viewedPosts, postId]);
    }
  };

  const isNewPost = (date: string) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return new Date().getTime() - new Date(date).getTime() < oneDayInMilliseconds;
  };

  const isViewedPost = (postId: number) => {
    return viewedPosts.includes(postId);
  };

  return (
    <div className="max-w-5xl mx-auto md:px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bảng tin</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-color to-blue-500 hover:opacity-90 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {showForm ? "✕ Đóng form" : "Bạn cần Mua-Thuê?"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-green-400">
            <div className="space-y-6">
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">Loại tin</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 transition-all duration-200"
                >
                  <option value="Cần mua">Cần mua</option>
                  <option value="Cần thuê">Cần thuê</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-700 font-semibold mb-2 block">Nội dung chi tiết</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-color focus:ring-2 focus:ring-primary-color/20 transition-all duration-200"
                  rows={4}
                  placeholder="Ví dụ: Cần mua căn hộ 1 phòng ngủ, 2wc quanh quận 12. Liên hệ: 0909090909"
                  required
                />
              </div>

              {/* <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    className="w-5 h-5 rounded border-gray-300 text-primary-color focus:ring-primary-color"
                    disabled
                  />
                  <span className="ml-2 text-gray-700">Đăng tin ẩn danh</span>
                </label>
              </div> */}

              <button 
                type="submit" 
                className="w-full py-3 px-6 bg-gradient-to-r from-primary-color to-secondary-color text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Click vào để gởi thông tin
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {status === 'loading' ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-color border-t-transparent"></div>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : paginatedList.data.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 font-medium">Chưa có tin nào được đăng.</p>
          </div>
        ) : (
          paginatedList.data.map((post, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden
                ${isNewPost(post.createdAt.toString()) ? "ring-2 ring-green-500/20" : ""} 
                ${isViewedPost(Number(post.id)) ? "opacity-90" : "opacity-100"}`}
              onClick={() => handleView(Number(post.id))}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-700">Ẩn danh</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium
                    ${post.postType === "Cần mua" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {post.postType}
                  </span>
                </div>
                
                <p className={`text-gray-700 leading-relaxed text-justify ${isViewedPost(Number(post.id)) ? "font-normal" : "font-medium"}`}>
                  {post.content}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{post.timeAgo}</span>
                    <span>•</span>
                    <span>{post.views} lượt xem</span>
                  </div>
                  {isNewPost(post.createdAt.toString()) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Tin mới
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {status !== 'loading' && status !== 'error' && paginatedList.data.length > 0 && (
        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            onClick={() => {
              dispatch(getRealEstateListPaginated({ 
                page: Math.max(paginatedList.page - 1, 0), 
                size: paginatedList.size 
              }));
            }}
            disabled={paginatedList.page === 0}
            className="px-6 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            ← Trước
          </button>
          <span className="text-gray-600 font-medium">
            Trang {paginatedList.page + 1} / {Math.ceil(paginatedList.total / paginatedList.size)}
          </span>
          <button
            onClick={() => dispatch(getRealEstateListPaginated({ page: paginatedList.page + 1, size: paginatedList.size }))}
            disabled={paginatedList.page >= Math.ceil(paginatedList.total / paginatedList.size) - 1}
            className="px-6 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default BanTin;
