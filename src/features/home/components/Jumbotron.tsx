"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { jumbotronImg } from "../const";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const Jumbotron = () => {
  return (
    <div className="mb-28">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}>
        <CarouselContent className="">
          {jumbotronImg.map((img, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="relative w-full overflow-hidden h-[480px] rounded-lg">
                    <Image
                      src={img}
                      alt="jumbotron"
                      fill
                      className="object-cover duration-100"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Jumbotron;
