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
    <div className="mb-8 sm:mb-12 md:mb-20 lg:mb-28">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}>
        <CarouselContent>
          {jumbotronImg.map((img, index) => (
            <CarouselItem key={index}>
              <div className="p-0 sm:p-1">
                <Card>
                  <CardContent className="relative w-full overflow-hidden h-[280px] sm:h-[240px] md:h-[400px] lg:h-[480px] rounded-lg">
                    <Image
                      src={img}
                      alt="jumbotron"
                      fill
                      className="object-cover duration-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 80vw"
                      priority={index === 0}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default Jumbotron;
