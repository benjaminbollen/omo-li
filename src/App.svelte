<script lang="ts">
  import Transaction from "./Transaction.svelte";
  import { send, state } from "./StateMachine";
  import { routerMachine } from "xstate-router";
  import dayjs from "dayjs";

  $: currentDate = $state.context.currentDate;
  $: currentMonth = $state.context.currentMonth;

  const machineConfig = {
    initial: "main",
    context: { myValue: 0 },
    states: {
      main: { meta: { path: "/" } },
      blog: { meta: { path: "/blog" } },
    },
  };

  const service = routerMachine({
    config: machineConfig,
    options,
    initialContext,
  });

  // The state changes on a route change and the route changes on a state change.
  service.onTransition((state) => console.log(state.value));

  // The context is enhanced with router properties.
  service.onChange((ctx) => console.log(ctx));
  /* Context
    {
        myValue: 0,
        // Router properties:
        match,
        location,
        history,
    }
*/
</script>

<style global>
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

  @tailwind base;
  @tailwind utilities;
  @tailwind components;

  html,
  body {
    height: 100%;
    overflow: hidden;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

<main class="h-full p-12 font-sans text-center text-white bg-primary">
  <h1 class="text-3xl font-title">Omo Li</h1>
  <div class="">{dayjs(currentDate).format('MMMM - YYYY')}</div>
  <div class="flex justify-center">
    <div
      class="p-2 m-2 border-2 border-white rounded"
      on:click={() => send({ type: 'NAVIGATE', direction: 'BACK' })}>
      BACK
    </div>
    <div
      class="p-2 m-2 border-2 border-white rounded"
      on:click={() => send({ type: 'NAVIGATE', direction: 'HOME' })}>
      HOME
    </div>
    <div
      class="p-2 m-2 border-2 border-white rounded"
      on:click={() => send({ type: 'NAVIGATE', direction: 'FORWARD' })}>
      FORWARD
    </div>
  </div>
  <div class="h-full overflow-y-scroll">
    {#each currentMonth as transaction}
      <Transaction {transaction} />
    {/each}
  </div>
</main>