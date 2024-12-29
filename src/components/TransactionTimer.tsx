"use client";

import { axiosInstance } from "@/lib/axios";
import React, { useEffect, useState } from "react";

interface CronTimerProps {
  transactionId: number;
}

const CronTimer: React.FC<CronTimerProps> = ({ transactionId }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchTimeLeft = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/transactions/${transactionId}/time-left`
        );
        setTimeLeft(data.timeLeft);
      } catch (error) {
        console.error("Failed to fetch time left:", error);
      }
    };

    fetchTimeLeft();

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev && prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [transactionId]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (timeLeft === null) {
    return <div>Loading...</div>;
  }

  return <div>{formatTime(timeLeft)}</div>;
};

export default CronTimer;
