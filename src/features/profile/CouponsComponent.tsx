import CustomerProfileLayout from "./CustomerProfileLayout";
import CouponListWrapper from "./components/CouponListWrapper";
import TransactionListWrapper from "./components/TransactionListWrapper";

const CouponsComponent = () => {
  return (
    <CustomerProfileLayout>
      <CouponListWrapper />
    </CustomerProfileLayout>
  );
};

export default CouponsComponent;
