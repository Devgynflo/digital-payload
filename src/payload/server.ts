import express from "express";
import { getPayloadClient } from "./get-payload-client";
import { nextApp, nextHandler } from "./next-utils";
import { Payload } from "payload";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "../trpc";

const app = express();
const PORT = Number(process.env.EXPRESS_PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms: Payload) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  app.use((req, res) => nextHandler(req, res));
  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");
    app.listen(PORT, async () => {
      payload.logger.info(
        `Nestjs listen App URL ${process.env.NEXT_PUBLIC_SERVER_URL}`,
      );
    });
  });
};

start();
