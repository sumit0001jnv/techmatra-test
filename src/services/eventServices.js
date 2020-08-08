import axios from "axios";

export default {
  getAllEvents() {
    return axios.get("/api/v1/event-list").then((res) => res.data);
  },
  deleteEvent(params) {
    return axios
      .delete("/api/v1/event-list/" + params.id)
      .then((res) => res.data);
  },
  editEvent(params) {
    return axios
      .put("/api/v1/event-list/" + params._id, params)
      .then((res) => res.data);
  },
  addEvent(params) {
    return axios.post("/api/v1/event-list", params).then((res) => res.data);
  },
};
