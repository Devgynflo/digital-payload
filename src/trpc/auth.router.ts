import { AuthCredentialsValidator } from "../lib/validators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../payload/get-payload-client";
import { TRPCError } from "@trpc/server";

export const authrouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      //check user if already exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      await payload.create({
        collection: "users",
        data: { email, password, role: "user" },
      });

      return { success: true, sentToEmail: email };
    }),
});
