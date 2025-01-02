import CustomerProfileLayout from "./CustomerProfileLayout";
import TransactionListWrapper from "./components/TransactionListWrapper";

const TransactionHistoryComponent = () => {
  return (
    <CustomerProfileLayout>
      <TransactionListWrapper />
    </CustomerProfileLayout>
  );
};

export default TransactionHistoryComponent;
