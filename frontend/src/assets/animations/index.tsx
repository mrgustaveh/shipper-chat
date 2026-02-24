import Lottie from "lottie-react";
import LoadingAnimation from "./loading.json";

type props = {
  width?: string;
  height?: string;
};

export const Loading = ({ width = "2rem", height = "2rem" }: props) => {
  return (
    <div style={{ width: width, height: height }}>
      <Lottie animationData={LoadingAnimation} />
    </div>
  );
};
