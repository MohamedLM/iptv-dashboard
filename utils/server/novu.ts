import { ITopics, Novu, TriggerRecipientsTypeEnum } from "@novu/node";
import map from "lodash/map";

const novu = new Novu(process.env.NOVU_SECRET_KEY!);

export const identify = async (id: string, data: object) => {
  return novu.subscribers.identify(id, data);
};

export const createTopic = async (id: string, name?: string) => {
  return novu.topics.create({
    key: id,
    name: name || id,
  });
};

// https://docs.novu.co/concepts/topics#create-topic-on-the-fly
export const addSubscriberToTopic = async (
  topicKey: string,
  subscribers: Array<string>
) => {
  return novu.topics.addSubscribers(topicKey, {
    subscribers,
  });
};

export const triggerTopicNotification = async (
  workflowId: string,
  topicId: string | Array<string>,
  payload?: any
) => {
  const topics = Array.isArray(topicId) ? topicId : [topicId]; // Ensure topicId is an array

  return Promise.allSettled(
    map(topics, (topicKey) => {
      return novu.trigger(workflowId, {
        to: [{ type: TriggerRecipientsTypeEnum.TOPIC, topicKey: topicKey }],
        payload,
      });
    })
  );

  // not sure, but this is not working so we use promise all instead.
  // return novu.trigger(workflowId, {
  //   to: [
  //     { type: TriggerRecipientsTypeEnum.TOPIC, topicKey: "admin" },
  //     { type: TriggerRecipientsTypeEnum.TOPIC, topicKey: "test-api" },
  //   ],
  //   payload,
  // });
};
