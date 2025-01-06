"use client";

import HomePageLayout from "@/components/HomePageLayout";
import EventByUserCity from "./components/EventByUserCity";
import Jumbotron from "./components/Jumbotron";
import NewestEvent from "./components/NewestEvent";
import PublishYourEvent from "./components/PublishYourEvent";
import { useSession } from "next-auth/react";

const HomeComponent = () => {
  const { data } = useSession();
  const user = data?.user;

  return (
    <HomePageLayout>
      <Jumbotron />
      <NewestEvent />
      <EventByUserCity />
      {user && user?.role === "ORGANIZER" ? null : <PublishYourEvent />}
    </HomePageLayout>
  );
};

export default HomeComponent;
