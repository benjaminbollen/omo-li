<script lang="ts">
  import Compose from "src/libs/o-views/atoms/Compose.svelte";
  import Header from "src/libs/o-views/molecules/Header.svelte";
  import Tokens from "src/dapps/wallet/views/molecules/Tokens.svelte";
  let header = {
    title: "Tokens",
  };
  let address = localStorage.getItem("omo.safeAddress");
</script>

<Compose rows="48px auto 1fr" columns="1fr">
  <Compose>
    <Header data={header} />
  </Compose>
  <Compose tw="p-4" rows="1fr" columns="1fr" overflowY>
    <Tokens {address} />
  </Compose>
</Compose>
