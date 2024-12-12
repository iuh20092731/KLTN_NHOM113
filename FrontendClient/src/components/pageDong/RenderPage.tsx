import { getServiceByName } from "@/redux/thunks/service";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import Layout1 from "./Layout1";
import {useLocation } from "react-router-dom";
import { AppDispatch } from "@/redux/store";
import { resetService } from "@/redux/slices/service";
const RenderPage: React.FC = () => {
    const location = useLocation();
    const categoryId = location.state?.categoryId;
    const { page } = useParams<{ page: string }>();
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (page) {
        dispatch(resetService());
        dispatch(getServiceByName(page));
        }
    }, [dispatch, page]);


    let layoutToShow;
    switch (categoryId % 3) {
        case 0:
            layoutToShow = <Layout1 />;
            break;
        case 1:
            layoutToShow = <Layout2 />;
            break;
        case 2:
            layoutToShow = <Layout3 />;
            break;
        default:
            layoutToShow = <Layout1 />;
    }

    return (
    <>
        {layoutToShow}
    </> 
  );
};

export default RenderPage;
