import DashboardLayout from "@/components/DashboardLayout";
import TransactionsList from "@/features/dashboard/transaction";

const OrganizerTransactionsList = () => {
  return (
    <DashboardLayout>
      <TransactionsList />
    </DashboardLayout>
  );
};

export default OrganizerTransactionsList;
