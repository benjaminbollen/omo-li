<script lang="ts">
  export let data = {
    image: "",
    title: "",
    description: "",
    balance: "",
    currency: "",
  };

  let openDetail: boolean = false;

  function toggleExpand() {
    openDetail = !openDetail;
  }
</script>

<style>
  .card {
    display: grid;
    grid-template-columns: 3.5rem 1fr 1fr;
    grid-template-rows: 3.5rem;
    max-width: 100%;
  }
</style>

<div>
  <div
    on:click={toggleExpand}
    class="w-full bg-white border rounded card border-light-200">
    <div class="flex items-center justify-center p-2">
      <img src={data.image} alt="CRC" />
    </div>
    <div class="px-1 py-2">
      <div class="text-base text-primary">{data.title}</div>
      <p class="text-xs text-gray-500">
        <span class="text-xs text-gray-500">{data.currency}</span>
      </p>
    </div>
    <div class="p-1 px-4 text-right">
      <div class="py-1 text-3xl font-light text-action">
        {#if parseFloat(data.balance) < 1}
          {parseFloat(data.balance).toFixed(4)}
        {:else}{parseFloat(data.balance).toFixed(2)}{/if}
      </div>
    </div>
  </div>
  {#if data.description && openDetail}
    <div
      class="w-full p-2 text-xs text-gray-500 bg-white border-b border-l border-r border-light-200">
      Address:
      <span class="text-primary">{data.description}</span>
    </div>
  {/if}
</div>
