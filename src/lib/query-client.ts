import { QueryClient } from "@tanstack/react-query";
import { QUERY } from "@/constants/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY.STALE_TIME_MS,
      gcTime: QUERY.GC_TIME_MS,
      retry: QUERY.RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
