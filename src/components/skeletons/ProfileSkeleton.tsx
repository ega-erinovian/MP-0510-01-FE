import { FC } from "react";
import ProfileCardSkeleton from "./ProfileCardSkeleton";

interface ProfileSkeletonProps {
  dataQty: number;
}

const ProfileSkeleton: FC<ProfileSkeletonProps> = ({ dataQty }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(dataQty)].map((_, index) => (
        <ProfileCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProfileSkeleton;
