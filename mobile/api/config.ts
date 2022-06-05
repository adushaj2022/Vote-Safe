import axios from "axios";
import { address } from "../constants/Extras";

// put your IP address below followed by the port ur node server is running on (LOCALHOST MAY NOT WORK), I ran ipconfig in cmd and grabbed that value
export const _http = axios.create({
  baseURL: address,
});
