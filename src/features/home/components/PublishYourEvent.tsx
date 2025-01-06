import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PublishYourEvent = () => {
  return (
    <Card className="w-full p-4 lg:p-8">
      <CardHeader className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <CardTitle className="text-4xl xl:text-7xl lg:text-nowrap">
            Publish your events for free
          </CardTitle>
          <CardDescription className="lg:text-lg">
            Reach more people on the world's largest and most trusted events
            marketplace. Everything you need to host standout events and earn
            more.
          </CardDescription>
        </div>
        <div className="h-full lg:flex items-center justify-end">
          <Link href="/register/organizer">
            <Button className="lg:text-2xl h-fit lg:p-8 flex">
              Get Started <ArrowRight />
            </Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PublishYourEvent;
