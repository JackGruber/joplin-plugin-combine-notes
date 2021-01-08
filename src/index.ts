import joplin from "api";
import { MenuItemLocation } from "api/types";

joplin.plugins.register({
  onStart: async function () {
    console.info("Combine plugin started");

    await joplin.commands.register({
      name: "CombineNotes",
      label: "Combine selected notes",
      execute: async () => {
        const ids = await joplin.workspace.selectedNoteIds();
        if (ids.length > 1) {
        const newNoteBody = [];
        let notebookId = null;

        for (const noteId of ids) {
          const note = await joplin.data.get(["notes", noteId], {
            fields: ["title", "body", "parent_id"],
          });
          newNoteBody.push(["# " + note.title, "", note.body].join("\n"));

          if (!notebookId) notebookId = note.parent_id;
        }

        const newNote = {
          title: "Concatenated note",
          body: newNoteBody.join("\n\n"),
          parent_id: notebookId,
        };

        }
      },
    });

    await joplin.views.menuItems.create(
      "myMenuItemToolsCombineNotes",
      "CombineNotes",
      MenuItemLocation.Tools
    );
    await joplin.views.menuItems.create(
      'contextMenuItemconcatCombineNotes', 
      'CombineNotes', 
      MenuItemLocation.NoteListContextMenu
    );
  },
});
