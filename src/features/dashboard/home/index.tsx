import { auth } from "@/lib/auth";
import ActiveEvent from "./components/ActiveEvent";
import Income from "./components/Income";
import RecentSales from "./components/RecentSales";
import SalesRevenue from "./components/SalesRevenue";
import TicketsSold from "./components/TicketsSold";

const Home = async () => {
  const session = await auth();

  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-4 h-full p-8">
      <TicketsSold id={Number(session?.user.id)} />
      <Income id={Number(session?.user.id)} />
      <ActiveEvent id={Number(session?.user.id)} />
      <SalesRevenue id={Number(session?.user.id)} />
      <RecentSales id={Number(session?.user.id)} />
    </div>
  );
};

export default Home;
