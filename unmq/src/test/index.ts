import IframeMessage, { SelfIframe } from "../plugin/message/IframeMessage";

const i = new IframeMessage(
  "self",
  new SelfIframe(),
  {
    ex1: new SelfIframe(),
  },
  {},
);
i.emit("ex1", "fsd");
