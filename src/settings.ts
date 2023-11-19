import joplin from "api";
import { SettingItemType } from "api/types";
import { i18n } from "./combineNote";

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
        label: i18n.__("settings.asToDo"),
      },

      deleteCombinedNotes: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.deleteCombinedNotes"),
      },

      preserveSourceNoteTitles: {
        value: true,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveSourceNoteTitles"),
        description: i18n.__("settings.preserveSourceNoteTitlesDescription"),
      },

      preserveMetadataSourceUrl: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataSourceUrl"),
        description: i18n.__("settings.preserveMetadataSourceUrlDescription"),
      },

      preserveMetadataCreatedDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataCreatedDate"),
        description: i18n.__("settings.preserveMetadataCreatedDateDescription"),
      },

      preserveMetadataUpdatedDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataUpdatedDate"),
        description: i18n.__("settings.preserveMetadataUpdatedDateDescription"),
      },

      preserveMetadataLocation: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataLocation"),
        description: i18n.__("settings.preserveMetadataLocationDescription"),
      },

      addCombineDate: {
        value: false,
        type: SettingItemType.Bool,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.addCombineDate"),
        description: i18n.__("settings.addCombineDateDescription"),
      },

      preserveMetadataPrefix: {
        value: "",
        type: SettingItemType.String,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataPrefix"),
        description: i18n.__("settings.preserveMetadataPrefixDescription"),
      },

      preserveMetadataSuffix: {
        value: "",
        type: SettingItemType.String,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.preserveMetadataSuffix"),
        description: i18n.__("settings.preserveMetadataSuffixDescription"),
      },

      combinedNoteTitle: {
        value: "default",
        type: SettingItemType.String,
        section: "combineNoteSection",
        isEnum: true,
        public: true,
        label: i18n.__("settings.combinedNoteTitle"),
        options: {
          default: i18n.__("settings.combinedNoteTitleValueDefault"),
          combined: i18n.__("settings.combinedNoteTitleValueCombined"),
          first: i18n.__("settings.combinedNoteTitleValueFirst"),
          last: i18n.__("settings.combinedNoteTitleValueLast"),
          custom: i18n.__("settings.combinedNoteTitleValueCustom"),
        },
      },

      combinedNoteTitleCustom: {
        value: "",
        type: SettingItemType.String,
        section: "combineNoteSection",
        public: true,
        label: i18n.__("settings.combinedNoteTitleCustom"),
        description: i18n.__(
          "settings.combinedNoteTitleCustomDescription",
          "{{FIRSTTITLE}}, {{LASTTITLE}}, {{ALLTITLE}}, {{DATE}}"
        ),
      },
    });
  }
}
