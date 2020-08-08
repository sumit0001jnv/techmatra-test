const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const eventList = fs.readFileSync(`${__dirname}/data/event-list.json`, "utf8");
const evenListArr = JSON.parse(eventList);
app.get("/api/v1/event-list", (req, res) => {
  res.status(200).json({
    status: "Success",
    data: { "event-list": evenListArr },
  });
});
app.post("/api/v1/event-list", (req, res) => {
  let newEvent = req.body;
  newEvent._id = evenListArr.length + 1;
  evenListArr.push(newEvent);
  let jsonEventList = JSON.stringify(evenListArr);
  fs.writeFile(`${__dirname}/data/event-list.json`, jsonEventList, (err) => {
    if (err) {
      res.send("Unable to write to file");
      return;
    }
    res.status(201).json({
      status: "success",
      data: {
        events: newEvent,
      },
    });
  });
});
app.delete("/api/v1/event-list/:id", (req, res) => {
  let index = evenListArr.findIndex((event) => {
    return event._id.toString() === req.params.id.toString();
  });

  if (index > -1) {
    evenListArr.splice(index, 1);
    let jsonEventList = JSON.stringify(evenListArr);
    fs.writeFile(`${__dirname}/data/event-list.json`, jsonEventList, (err) => {
      if (err) {
        res.send("Unable to write to file");
        return;
      }
      res.send("Event deleted");
    });
  } else {
    res.send("Error while deleting");
  }
});
app.put("/api/v1/event-list/:id", (req, res) => {
  let index = evenListArr.findIndex((event) => {
    return event._id.toString() === req.params.id.toString();
  });
  if (index > -1) {
    let newEvent = req.body;
    evenListArr[index] = newEvent;
    let jsonEventList = JSON.stringify(evenListArr);
    fs.writeFile(`${__dirname}/data/event-list.json`, jsonEventList, (err) => {
      if (err) {
        res.send("Unable to write to file");
        return;
      }
      res.status(201).json({
        status: "success",
        data: {
          event: newEvent,
        },
      });
    });
  } else {
    res.send("Error while updating");
  }
});
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
process.on("unhandledRejection", (err) => console.log(err));
