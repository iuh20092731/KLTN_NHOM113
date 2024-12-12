import { useParams } from "react-router-dom";
import ChiTietQuangCao from "./ChiTietQuangCao";

const QuanLyAdver: React.FC = () => {
    const { id } = useParams();
    return (
        <ChiTietQuangCao adId={Number(id)} />
    );
};

export default QuanLyAdver;
