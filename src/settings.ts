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
    });
  }
}
