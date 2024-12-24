import UpdateProfileComponent from "@/features/profile/EditUserComponent";

const EditProfile = ({ params }: { params: { id: string } }) => {
  return <UpdateProfileComponent id={parseInt(params.id)} />;
};

export default EditProfile;
