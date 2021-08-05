import joplin from "api";
import { SettingItemType } from "api/types";

export namespace settings {
  export async function register() {
    await joplin.settings.registerSection("combineNoteSection", {
      label: "Combine notes",
      iconName: "fas fa-layer-group",
    });

    await joplin.settings.registerSettings({
      asToDo: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Create combined note as to-do",
      },

      deleteCombinedNotes: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Delete combined notes",
      },

      preserveMetadataSourceUrl: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Preserve Source URL",
        description:
          "Preserve the Source by inserting them under the header from the note.",
      },

      preserveMetadataCreatedDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Preserve Created Date",
        description:
          "Preserve the Created Date by inserting them under the header from the note.",
      },

      preserveMetadataUpdatedDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Preserve Updated Date",
        description:
          "Preserve the Updated Date by inserting them under the header from the note.",
      },

      preserveMetadataLocation: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Preserve Location",
        description:
          "Preserve the Location Date by inserting them under the header from the note.",
      },

      addCombineDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: "Add combine date",
        description: "Add the combine date under the header of the notes.",
      },

      preserveMetadataPrefix: {
        value: "",
        type: SettingItemType.String,
        section: "combineNoteSection",
        public: true,
        label: "Metadata Prefix",
        description: "Prefix for the Metadata section.",
      },

      preserveMetadataSuffix: {
        value: "",
        type: SettingItemType.String,
        section: "combineNoteSection",
        public: true,
        label: "Metadata Suffix",
        description: "Suffix for the Metadata section.",
      },
    });
  }
}
