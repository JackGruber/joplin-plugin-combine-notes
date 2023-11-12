import joplin from "api";
import { I18n } from "i18n";
import * as path from "path";
import * as moment from "moment";
import { settings } from "./settings";
import { MenuItemLocation } from "api/types";

let i18n: any;

namespace combineNote {
  export async function init() {
    await combineNote.translate();
    await settings.register();
    await combineNote.registerCommands();
  }

  export async function registerCommands() {
    await joplin.commands.register({
      name: "CombineNotes",
      label: i18n.__("cmd.combinenote"),
      execute: async () => {
        await combineNote.combine();
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
  }

  export async function combine() {
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
          preserveMetadata.push(
            "[" + i18n.__("field.sourceURL") + "](" + note.source_url + ")"
          );
        }

        if (preserveCreatedDate === true) {
          const createdDate = await combineNote.getDateFormated(
            note.created_time,
            dateFormat,
            timeFormat
          );
          preserveMetadata.push(
            i18n.__("field.createdDate") + ": " + createdDate
          );
        }

        if (preserveUpdatedDate === true) {
          const updatedDate = await combineNote.getDateFormated(
            note.updated_time,
            dateFormat,
            timeFormat
          );
          preserveMetadata.push(
            i18n.__("field.updatedDate") + ": " + updatedDate
          );
        }

        if (addCombineDate === true) {
          const combineDate = await combineNote.getDateFormated(
            new Date().getTime(),
            dateFormat,
            timeFormat
          );
          preserveMetadata.push(
            i18n.__("field.combineDate") + ": " + combineDate
          );
        }

        if (
          preserveMetadataLocation === true &&
          (note.latitude != "0.00000000" ||
            note.longitude != "0.00000000" ||
            note.altitude != "0.0000")
        ) {
          preserveMetadata.push(
            [
              i18n.__("field.location") + ":",
              i18n.__("field.locationLat") + ":",
              note.latitude,
              i18n.__("field.locationLon") + ":",
              note.longitude,
              i18n.__("field.locationAltitude") + ":",
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
      const deleteNotes = await joplin.settings.value("deleteCombinedNotes");
      if (deleteNotes === true) {
        for (const noteId of ids) {
          await joplin.data.delete(["notes", noteId]);
        }
      }

      await joplin.commands.execute("openNote", newNote.id);
    }
  }

  export async function translate() {
    const joplinLocale = await joplin.settings.globalValue("locale");
    const installationDir = await joplin.plugins.installationDir();

    i18n = new I18n({
      locales: ["en_US", "de_DE"],
      defaultLocale: "en_US",
      fallbacks: { "en_*": "en_US" },
      updateFiles: false,
      retryInDefaultLocale: true,
      syncFiles: true,
      directory: path.join(installationDir, "locales"),
    });
    i18n.setLocale(joplinLocale);
  }

  export async function getDateFormated(
    epoch: number,
    dateFormat: string,
    timeFormat: string
  ): Promise<string> {
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
}

export { combineNote, i18n };
