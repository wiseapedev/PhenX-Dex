async function delayer(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function delay() {
  await delayer(200);
}
export default delay;
