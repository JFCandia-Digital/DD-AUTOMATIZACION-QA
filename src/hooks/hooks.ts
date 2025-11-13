import { Before } from "@cucumber/cucumber";
import dotenv from "dotenv";
import { apiContext } from "../common/support/apiContext";

dotenv.config({ path: '.env.api' });

Before(function () {
  apiContext.attachData = {};
});