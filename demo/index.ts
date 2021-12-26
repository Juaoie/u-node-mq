const promiseSetTimeout = (time = 0) => new Promise((resolve) => setTimeout(resolve, time));
console.log("-----------");
// async function main() {
//   const { createApp, defineComponent, h } = Vue;
//   console.log(Vue);
//   const App = defineComponent({
//     render() {
//       return h("h1", {}, "Some title");
//     },
//     created() {
//       console.log("zhixin");
//       const unmq = new UNodeMQ();
//     },
//   });

//   const app = createApp(App);
//   app.mount("#app");
// }
// main();
