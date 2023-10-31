import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkin } from "@hooks/useSkin";

const SkeletonComponent = ({ count }) => {
  const { skin } = useSkin();

  return (
    <div className="w-100"
      style={{ backgroundColor: skin === "dark" ? "#283046" : "white" }}>
      <SkeletonTheme baseColor="#6e6b7b" highlightColor="#243070">
        <Skeleton count={count || 5} />
      </SkeletonTheme>
    </div>
  );
};

export default SkeletonComponent;
