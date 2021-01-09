import joplin from "api";
import { MenuItemLocation, SettingItemType } from "api/types";

joplin.plugins.register({
  onStart: async function () {
    console.info("Combine plugin started");

    await joplin.settings.registerSection("combineNoteSection", {
      label: "Combine note",
      iconName: "fas fa-layer-group",
    });

    await joplin.settings.registerSetting("asToDo", {
      value: false,
      type: SettingItemType.Bool,
      section: "combineNoteSection",
      public: true,
      label: "Create combined note as to-do",
    });

    await joplin.settings.registerSetting("preserveMetadataSourceUrl", {
      value: false,
      type: SettingItemType.Bool,
      section: "combineNoteSection",
      public: true,
      label: "Preserve Source URL",
      description:
        "Preserve the Source by inserting them under the header from the note.",
    });

    await joplin.settings.registerSetting("preserveMetadataCreatedDate", {
      value: false,
      type: SettingItemType.Bool,
      section: "combineNoteSection",
      public: true,
      label: "Preserve Created Date",
      description:
        "Preserve the Created Date by inserting them under the header from the note.",
    });

    await joplin.settings.registerSetting("preserveMetadataUpdatedDate", {
      value: false,
      type: SettingItemType.Bool,
      section: "combineNoteSection",
      public: true,
      label: "Preserve Updated Date",
      description:
        "Preserve the Updated Date by inserting them under the header from the note.",
    });

    await joplin.settings.registerSetting("preserveMetadataLocation", {
      value: false,
      type: SettingItemType.Bool,
      section: "combineNoteSection",
      public: true,
      label: "Preserve Location",
      description:
        "Preserve the Location Date by inserting them under the header from the note.",
    });

    await joplin.settings.registerSetting("preserveMetadataPrefix", {
      value: "",
      type: SettingItemType.String,
      section: "combineNoteSection",
      public: true,
      label: "Metadata Prefix",
      description: "Prefix for the Metadata section.",
    });

    await joplin.settings.registerSetting("preserveMetadataSuffix", {
      value: "",
      type: SettingItemType.String,
      section: "combineNoteSection",
      public: true,
      label: "Metadata Suffix",
      description: "Suffix for the Metadata section.",
    });

    await joplin.commands.register({
      name: "CombineNotes",
      label: "Combine selected notes",
      execute: async () => {
        const ids = await joplin.workspace.selectedNoteIds();
        if (ids.length > 1) {
          const newNoteBody = [];
          let notebookId = null;
          const newTags = [];
          let createdDate = null;
          let updatedDate = null;
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
              createdDate = new Date(note.created_time);
              preserveMetadata.push("Created: " + createdDate + ")");
            }

            if (preserveUpdatedDate === true) {
              updatedDate = new Date(note.updated_time);
              preserveMetadata.push("Updated: " + updatedDate + ")");
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
