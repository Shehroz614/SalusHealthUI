import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const InlineSkeletonComponent = ({ count }) => {
    
  return (
      <SkeletonTheme baseColor="#6e6b7b" highlightColor="#da6969" >
        <Skeleton count={count || 4} inline={true} />
      </SkeletonTheme>
  );
};

export default InlineSkeletonComponent;