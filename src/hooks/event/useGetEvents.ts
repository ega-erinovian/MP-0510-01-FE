import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const useGetEvents = () => {
  // useQuery sudah otomatis melakukan caching
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/events");
      return data;
    },
  });
};

export default useGetEvents;

// const useGetEvents = () => {
//   const [data, setData] = useState<EventType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const { data } = await axios.get("http://localhost:8000/events");
//         setData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return { data, isLoading };
// };

// export default useGetEvents;
