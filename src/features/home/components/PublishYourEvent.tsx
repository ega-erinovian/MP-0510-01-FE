import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const PublishYourEvent = () => {
  return (
    <Card className="w-full p-8">
      <CardHeader className="grid grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <CardTitle className="text-7xl text-nowrap">
            Publish your events for free
          </CardTitle>
          <CardDescription className="text-lg">
            Reach more people on the world's largest and most trusted events
            marketplace. Everything you need to host standout events and earn
            more.
          </CardDescription>
        </div>
        <div className="h-full flex items-center justify-end">
          <Link href="/register/organizer">
            <Button className="text-2xl h-fit p-8">Get Started</Button>
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PublishYourEvent;
