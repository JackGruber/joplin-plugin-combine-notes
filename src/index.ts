import joplin from "api";
import { MenuItemLocation } from "api/types";
import { settings } from "./settings";
import * as moment from "moment";
import { i18n, combineNote } from "./combineNote";

joplin.plugins.register({
  onStart: async function () {
    console.info("Combine plugin started");

    await combineNote.translate();
    await settings.register();

    function getDateFormated(
      epoch: number,
      dateFormat: string,
      timeFormat: string
    ) {
      if (epoch !== 0) {
        const dateObject = new Date(epoch);
        const dateString =
          moment(dateObject.getTime()).format(dateFormat) +
          " " +
          moment(dateObject.getTime()).format(timeFormat);

        return dateString;
      } else {
        return "";
      }
    }

    await joplin.commands.register({
      name: "CombineNotes",
      label: i18n.__("cmd.combinenote"),
      execute: async () => {
        const ids = await joplin.workspace.selectedNoteIds();
        if (ids.length > 1) {
          const newNoteBody = [];
          let notebookId = null;
          const newTags = [];
          let preserveMetadata = [];
          const preserveUrl = await joplin.settings.value(
            "preserveMetadataSourceUrl"
          );
          const preserveCreatedDate = await joplin.settings.value(
            "preserveMetadataCreatedDate"
          );
          const preserveUpdatedDate = await joplin.settings.value(
            "preserveMetadataUpdatedDate"
          );
          const preserveMetadataLocation = await joplin.settings.value(
            "preserveMetadataLocation"
          );
          const preserveMetadataPrefix = await joplin.settings.value(
            "preserveMetadataPrefix"
          );
          const preserveMetadataSuffix = await joplin.settings.value(
            "preserveMetadataSuffix"
          );
          const addCombineDate = await joplin.settings.value("addCombineDate");
          const dateFormat = await joplin.settings.globalValue("dateFormat");
          const timeFormat = await joplin.settings.globalValue("timeFormat");

          // collect note data
          for (const noteId of ids) {
            preserveMetadata = [];
            const note = await joplin.data.get(["notes", noteId], {
              fields: [
                "title",
                "body",
                "parent_id",
                "source_url",
                "created_time",
                "updated_time",
                "latitude",
                "longitude",
                "altitude",
              ],
            });
            newNoteBody.push("# " + note.title + "\n");

            // Preserve metadata
            if (preserveUrl === true && note.source_url != "") {
              preserveMetadata.push("[Source](" + note.source_url + ")");
            }

            if (preserveCreatedDate === true) {
              const createdDate = getDateFormated(
                note.created_time,
                dateFormat,
                timeFormat
              );
              preserveMetadata.push("Created: " + createdDate);
            }

            if (preserveUpdatedDate === true) {
              const updatedDate = getDateFormated(
                note.updated_time,
                dateFormat,
                timeFormat
              );
              preserveMetadata.push("Updated: " + updatedDate);
            }

            if (addCombineDate === true) {
              const combineDate = getDateFormated(
                new Date().getTime(),
                dateFormat,
                timeFormat
              );
              preserveMetadata.push("Combined: " + combineDate);
            }

            if (
              preserveMetadataLocation === true &&
              (note.latitude != "0.00000000" ||
                note.longitude != "0.00000000" ||
                note.altitude != "0.0000")
            ) {
              preserveMetadata.push(
                [
                  "Location:",
                  "Lat:",
                  note.latitude,
                  "Lon:",
                  note.longitude,
                  "Altitude:",
                  note.altitude,
                ].join(" ")
              );
            }

            if (preserveMetadata.length > 0) {
              if (preserveMetadataPrefix != "") {
                newNoteBody.push(preserveMetadataPrefix + "\n");
              }

              newNoteBody.push(preserveMetadata.join("\n") + "\n");

              if (preserveMetadataSuffix != "") {
                newNoteBody.push(preserveMetadataSuffix + "\n");
              }
            }

            newNoteBody.push(note.body + "\n");

            let pageNum = 0;
            do {
              var noteTags = await joplin.data.get(["notes", noteId, "tags"], {
                fields: "id",
                limit: 50,
                page: pageNum++,
              });
              for (const tag of noteTags.items) {
                if (newTags.indexOf(tag.id) === -1) {
                  newTags.push(tag.id);
                }
              }
            } while (noteTags.has_more);

            if (!notebookId) notebookId = note.parent_id;
          }

          const asToDo = await joplin.settings.value("asToDo");

          // create new note
          const newNoteData = {
            title: "Combined note",
            body: newNoteBody.join("\n"),
            parent_id: notebookId,
            is_todo: asToDo,
          };
          const newNote = await joplin.data.post(["notes"], null, newNoteData);

          // Add Tags
          for (const tag of newTags) {
            await joplin.data.post(["tags", tag, "notes"], null, {
              id: newNote.id,
            });
          }

          // delete combined notes
          const deleteNotes = await joplin.settings.value(
            "deleteCombinedNotes"
          );
          if (deleteNotes === true) {
            for (const noteId of ids) {
              await joplin.data.delete(["notes", noteId]);
            }
          }

          await joplin.commands.execute("openNote", newNote.id);
        }
      },
    });

    await joplin.views.menuItems.create(
      "myMenuItemToolsCombineNotes",
      "CombineNotes",
      MenuItemLocation.Tools
    );
    await joplin.views.menuItems.create(
      "contextMenuItemconcatCombineNotes",
      "CombineNotes",
      MenuItemLocation.NoteListContextMenu
    );
  },
});
