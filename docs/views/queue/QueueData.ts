import { QueueName } from "src/internal/queue";
import { ref } from "vue";

const queueNameList = ref<QueueName[]>(["queue1", "queue2"]);
export { queueNameList };
