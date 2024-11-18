import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center">
            <ClipLoader color="#3b82f6" size={50} />
        </div>
    );
};

export default LoadingSpinner;