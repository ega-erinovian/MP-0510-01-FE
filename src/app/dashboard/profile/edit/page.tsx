import DashboardLayout from "@/components/DashboardLayout";
import UpdateProfileComponent from "@/features/dashboard/profile/EditUserComponent";

const EditProfile = () => {
  return (
    <DashboardLayout>
      <UpdateProfileComponent />
    </DashboardLayout>
  );
};

export default EditProfile;
