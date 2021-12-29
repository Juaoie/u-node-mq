import UNodeMQ from "../dist/UNodeMQ";
import Process from "../dist/plugin/process";
const unmq = new UNodeMQ<string>({ exchangeName: "exch" });

const process = new Process<string>();
unmq.use(process);