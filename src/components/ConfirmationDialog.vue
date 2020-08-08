<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ dialogHeader }}</v-card-title>

        <v-card-text>
          {{ dialogDescription }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-1"
            text
            @click="
              $emit('cancel');
              dialog = false;
            "
          >
            cancel
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="
              $emit('ok');
              dialog = false;
            "
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: {
    dialogHeader: String,
    dialogDescription: String,
    showDialog: Boolean,
  },
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    showDialog: {
      handler(newV) {
        this.dialog = newV;
      },
    },
  },
};
</script>
