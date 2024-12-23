import ResetPasswordComponent from "@/features/auth/reset-password";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  return <ResetPasswordComponent token={params.token} />;
};

export default ResetPassword;
