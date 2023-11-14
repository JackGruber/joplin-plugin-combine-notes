import joplin from "api";
import { combineNote } from "./combineNote";

joplin.plugins.register({
  onStart: async function () {
    console.info("Combine plugin started");
    await combineNote.init();
  },
});
