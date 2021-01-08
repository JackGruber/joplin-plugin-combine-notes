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
          const newTags = [];

          for (const noteId of ids) {
            const note = await joplin.data.get(["notes", noteId], {
              fields: ["title", "body", "parent_id"],
            });
            newNoteBody.push(["# " + note.title, "", note.body].join("\n"));

            let pageNum = 0;
            do {
              var noteTags = await joplin.data.get(["notes", noteId, "tags"], {
                fields: "id",
                limit: 50,
                page: pageNum++,
              });
              for (const tag of noteTags.items) {
                if(newTags.indexOf(tag.id) === -1) {
                  newTags.push(tag.id)
                }              
              }
            } while (noteTags.has_more);

            if (!notebookId) notebookId = note.parent_id;
          }

          const newNoteData = {
            title: "Concatenated note",
            body: newNoteBody.join("\n\n"),
            parent_id: notebookId,
          };
          const newNote = await joplin.data.post(["notes"], null, newNoteData);

          // Add Tags
          for (const tag of newTags) {
            await joplin.data.post(
              ["tags", tag, "notes"],
              null,
              { id: newNote.id }
            );
          }

          await joplin.commands.execute('openNote', newNote.id);
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
