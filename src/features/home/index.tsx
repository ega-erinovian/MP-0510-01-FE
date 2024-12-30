import HomePageLayout from "@/components/HomePageLayout";
import EventByUserCity from "./components/EventByUserCity";
import Jumbotron from "./components/Jumbotron";
import NewestEvent from "./components/NewestEvent";

const HomeComponent = () => {
  return (
    <HomePageLayout>
      <Jumbotron />
      <NewestEvent />
      <EventByUserCity />
    </HomePageLayout>
  );
};

export default HomeComponent;
