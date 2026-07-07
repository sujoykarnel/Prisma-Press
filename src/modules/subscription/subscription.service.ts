import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";
import {
  handleCheckoutComplete,
  handleChengeSubscription,
} from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
  const transectionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_Id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transectionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.strip_webhook_secret as string;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // payment complete
      await handleCheckoutComplete(event.data.object);

      break;
    case "customer.subscription.updated":
      // customer update

      /**
       *for test: stripe subscriptions cancel sub_1Tq8ZRB9szafbIqYJYhafKcj
       */
      await handleChengeSubscription(event.data.object);
      break;
    case "customer.subscription.deleted":
      // customer delete
      await handleChengeSubscription(event.data.object);
      break;

    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getSubscriptionStatus = async (userId: string) => {
  const isSubscriptionExist = await prisma.subscription.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const isActive =
    isSubscriptionExist.status === "ACTIVE" &&
    isSubscriptionExist.currentPeriodEnd &&
    new Date(isSubscriptionExist.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExist.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExist.currentPeriodEnd,
  };
};

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus
};
