import { auth } from "@/lib/auth";
import ActiveEvent from "./components/ActiveEvent";
import Income from "./components/Income";
import RecentSales from "./components/RecentSales";
import SalesRevenue from "./components/SalesRevenue";
import TicketsSold from "./components/TicketsSold";

const Home = async () => {
  const session = await auth();
  const userId = Number(session?.user.id);

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-6">
      <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <TicketsSold id={userId} />
      </div>

      <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <Income id={userId} />
      </div>

      <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <ActiveEvent id={userId} />
      </div>

      <div className="col-span-8 bg-white rounded-lg shadow-sm border border-gray-100">
        <SalesRevenue id={userId} />
      </div>

      <div className="col-span-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <RecentSales id={userId} />
      </div>
    </div>
  );
};

export default Home;
