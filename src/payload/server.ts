import express from "express";
import { getPayloadClient } from "./get-payload-client";
import { nextApp, nextHandler } from "./next-utils";
import { Payload } from "payload";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "../trpc";
import nextBuild from "next/dist/build";
import path from "path";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "../webhooks";

const app = express();
const PORT = Number(process.env.EXPRESS_PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer }; // Permet de s'assurer que cela provient bien de stripe
const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms: Payload) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../../"));

      process.exit();
    });

    return;
  }

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
