import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { getLinkGroup } from '@/redux/thunks/linkGroup';

const SocialGroups: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const linkGroup = useSelector((state: RootState) => state.linkGroup.links);

  useEffect(() => {
    dispatch(getLinkGroup());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-green-500">
        Link nhóm Zalo, Facebook
      </h1>
      <p className="text-center mb-8 text-base font-medium text-gray-700">
        Kết nối với cư dân Hưng Ngân qua các nền tảng mạng xã hội:
      </p>
      <div className="space-y-4">
        {linkGroup.map((group, groupIndex) => (
          <div
            key={groupIndex}
            onClick={() => window.open(group.groupLink, '_blank')}
            className="border border-gray-200 p-4 rounded-md shadow-md bg-gray-50 hover:bg-green-100 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-4">
              <img
                src={group.imageUrl || '/default-image.png'}
                alt={group.platform}
                className="w-16 h-16 object-contain rounded-lg shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Nhóm {group.platform}
                </h2>
                <p className="text-gray-600 text-sm">
                  {group.description || 'Không có mô tả'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialGroups;
