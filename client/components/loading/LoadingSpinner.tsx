import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color="#3b82f6" size={50} />
            </div>
        </div>
    );
};

export default LoadingSpinner;