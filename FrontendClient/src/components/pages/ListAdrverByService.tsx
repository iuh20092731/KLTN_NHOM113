import React from 'react';
import { InterestBanner } from '../common';
import ListAdver from '../common/ListAdver';

const ListAdrverByService: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
        <div className="col-span-1 md:col-span-4">
          <ListAdver />
        </div>
        <div className="hidden md:block row-span-4 col-start-1 md:col-start-5 col-span-2 md:row-start-1">
          <InterestBanner />
        </div>
      </div>
    </>
  );
};

export default ListAdrverByService;