<template>
  <v-app>
    <v-main>
      <EventTable />
    </v-main>
  </v-app>
</template>

<script>
import EventTable from "./pages/EventTable";

export default {
  name: "App",

  components: {
    EventTable,
  },
};
</script>
