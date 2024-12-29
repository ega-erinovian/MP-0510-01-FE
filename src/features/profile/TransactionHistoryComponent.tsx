import TransactionList from "./components/TransactionList";
import CustomerProfileLayout from "./CustomerProfileLayout";

const TransactionHistoryComponent = () => {
  return (
    <CustomerProfileLayout>
      <TransactionList />
    </CustomerProfileLayout>
  );
};

export default TransactionHistoryComponent;
