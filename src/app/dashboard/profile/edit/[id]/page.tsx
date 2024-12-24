import DashboardLayout from "@/components/DashboardLayout";
import UpdateProfileComponent from "@/features/dashboard/profile/EditUserComponent";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return (
    <DashboardLayout>
      <UpdateProfileComponent id={parseInt(params.id)} />
    </DashboardLayout>
  );
};

export default EditProfile;
