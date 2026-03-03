import { ENV } from "@/config/env";
import { API } from "@/constants/constants";

interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
}

const config: Config = {
  api: {
    baseUrl: ENV.API_BASE_URL,
    timeout: API.TIMEOUT_MS,
  },
};

export default config;
