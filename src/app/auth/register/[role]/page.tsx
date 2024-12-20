import RegisterComponent from "@/features/auth/register";

const Register = ({ params }: { params: { role: string } }) => {
  const { role } = params;
  return <RegisterComponent role={role} />;
};

export default Register;
