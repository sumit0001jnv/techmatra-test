<template>
  <v-container
    fluid
    class="pa-4 ma-0"
    style="background-color:#E7EEF3;min-height:100%"
  >
    <v-data-table
      :headers="headers"
      :items="events"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Events List</v-toolbar-title>
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-btn color="primary" text dark class="mb-2" @click="newEventClick"
            >Add event</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="onEditClick(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="ondeleteClick(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.is-active="{ item }">
        <v-chip
          :color="
            isActive(item) === 'Upcomming'
              ? 'green'
              : isActive(item) === 'Ongoing'
              ? 'orange'
              : 'red'
          "
          dark
          >{{ isActive(item) }}</v-chip
        >
      </template>
      <template v-slot:item.event-image="{ item }">
        <img
          v-show="item['event-image']"
          :src="item['event-image']"
          :width="64"
          :height="64"
          alt
        />
      </template>
    </v-data-table>
    <v-navigation-drawer v-model="drawer" :width="400" right absolute>
      <v-container fluid pa-4>
        <v-toolbar-title>
          <v-row class="pa-0 ma-0" no-gutters justify="center" align="center">
            <span v-if="isAdd">Add event</span>
            <span v-else-if="isEdit">Edit event</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="onCloseNavigation">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar-title>
        <v-col sm="12" class="pa-2 ma-0">
          <v-row class="pa-0 ma-0">
            <v-text-field
              v-model="defaultItem.name"
              :rules="rules"
              :label="'Event name'"
              required
              clearable
            ></v-text-field>
          </v-row>
          <v-row class="pa-0 ma-0" justify="center">
            <v-menu
              :nudge-bottom="34"
              v-model="dateFromMenu"
              :close-on-content-click="false"
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  :label="'Start date'"
                  class="mb-2"
                  prepend-icon="mdi-calendar-check"
                  v-model="defaultItem['start-date']"
                  hide-details
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="defaultItem['start-date']"
                type="date"
                reactive
                year-icon
                no-title
                @input="updateFrom"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <v-row class="pa-0 ma-0" justify="center">
            <v-menu
              :nudge-bottom="34"
              v-model="dateToMenu"
              :close-on-content-click="false"
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on }">
                <v-text-field
                  :label="'Start date'"
                  class="mb-2"
                  prepend-icon="mdi-calendar-check"
                  v-model="defaultItem['end-date']"
                  hide-details
                  v-on="on"
                  readonly
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="defaultItem['end-date']"
                type="date"
                reactive
                year-icon
                no-title
                @input="updateFrom"
              ></v-date-picker>
            </v-menu>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-select
              :placeholder="'Select event type'"
              v-model="defaultItem['event-type']"
              :items="eventTypes"
              required
              class="ma-0 mt-1"
            ></v-select>
          </v-row>
          <v-row class="pa-0 ma-0">
            <v-file-input
              v-if="drawer"
              show-size
              label="File input"
              @change="handleImage"
            ></v-file-input>
          </v-row>
          <v-row
            class="pa-0 ma-0"
            justify="center"
            align="center"
            no-gutters
            v-show="defaultItem['event-image']"
          >
            <img
              :src="defaultItem['event-image']"
              width="200"
              height="150"
              alt
            />
          </v-row>
          <v-row class="pa-0 ma-0" justify="end">
            <v-btn text @click="onCloseNavigation">Cancel</v-btn>
            <v-btn
              :disabled="validateForm"
              color="primary"
              style="height: 32px !important;min-width:64px !important;padding: 0 10px !important;"
              @click="onAdd"
              >{{ isAdd ? "Add" : "Update" }}</v-btn
            >
          </v-row>
        </v-col>
      </v-container>
    </v-navigation-drawer>
    <ConfirmationDialog
      :showDialog="showConfirmation"
      :dialogHeader="'Delete event'"
      :dialogDescription="'Do you want to delete this event'"
      @ok="deleteItem"
      @cancel="showConfirmation = false"
    ></ConfirmationDialog>
  </v-container>
</template>

<script>
import ConfirmationDialog from "../components/ConfirmationDialog";
import eventServices from "../services/eventServices.js";
export default {
  name: "EventTable",
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      showConfirmation: false,
      deletableItem: null,
      dateFromMenu: false,
      dateToMenu: false,
      isEdit: false,
      isAdd: false,
      rules: [(v) => !!v || "This field is required"],
      drawer: false,
      dialog: false,
      counter: 5,
      headers: [
        {
          text: "Event name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Start date", value: "start-date" },
        { text: "End date", value: "end-date" },
        { text: "Event type", value: "event-type" },
        { text: "Is active", value: "is-active" },
        { text: "Image", value: "event-image", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      eventTypes: ["Public event", "Festivities Event"],
      events: [],
      editedIndex: -1,

      defaultItem: {
        name: "",
        "start-date": "",
        "end-date": "",
        "event-type": "Public event",
        "event-image": "",
      },
    };
  },

  computed: {
    validateForm() {
      return !(
        this.defaultItem.name &&
        this.defaultItem["start-date"] &&
        this.defaultItem["end-date"] &&
        this.defaultItem["event-type"] &&
        this.defaultItem["event-image"]
      );
    },
  },
  created() {
    this.initialize();
  },

  methods: {
    isActive(item) {
      let startTimeStamp = new Date(item["start-date"]).getTime();
      let endTimeStamp = new Date(item["end-date"]).getTime();
      let currentDate = Date.now();
      if (currentDate > endTimeStamp) {
        return "Passed";
      } else if (currentDate > startTimeStamp && currentDate < endTimeStamp) {
        return "Ongoing";
      } else {
        return "Upcomming";
      }
    },
    initialize() {
      this.events = [];
      eventServices.getAllEvents().then((res) => {
        this.events = res.data["event-list"];
      });
    },
    clearDefaultItem() {
      this.defaultItem = {
        name: "",
        "start-date": "",
        "end-date": "",
        "event-type": "Public event",
        "event-image": "",
      };
    },
    newEventClick() {
      this.drawer = true;
      this.isAdd = true;
    },
    onEditClick(item) {
      this.isAdd = false;
      this.drawer = true;
      this.isEdit = true;
      this.defaultItem = item;
    },
    onAdd() {
      //api post api call
      if (this.isAdd) {
        this.defaultItem._id = this.counter++;
        this.events.push(this.defaultItem);
        eventServices
          .addEvent(this.defaultItem)
          .then(() => {
            this.onCloseNavigation();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let index = this.events.findIndex(
          (event) => event._id === this.defaultItem._id
        );
        this.events.splice(index, 1, this.defaultItem);
        eventServices
          .editEvent(this.defaultItem)
          .then(() => {
            this.onCloseNavigation();
          })
          .catch((err) => {
            console.log(err);
          });
        // this.onCloseNavigation();
      }
    },
    ondeleteClick(item) {
      this.deletableItem = item;
      this.showConfirmation = true;
    },
    deleteItem() {
      let index = this.events.findIndex(
        (event) => event._id === this.deletableItem._id
      );
      this.events.splice(index, 1);
      eventServices
        .deleteEvent({ id: this.deletableItem._id })
        .then(() => {
          this.showConfirmation = false;
          this.deletableItem = null;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onCloseNavigation() {
      this.clearDefaultItem();
      this.drawer = false;
    },
    updateFrom() {
      console.log(this.defaultItem["start-date"]);
    },
    handleImage(e) {
      //   const selectedImage = e.target.files[0];
      this.createBase64Image(e);
    },
    createBase64Image(image) {
      let _this = this;
      let reader = new FileReader();
      reader.onload = (e) => {
        _this.defaultItem["event-image"] = e.target.result;
      };
      reader.readAsDataURL(image);
    },
  },
};
</script>
