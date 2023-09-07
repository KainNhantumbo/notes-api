import type { TSettings } from '../@types/models';
import { Schema, model } from 'mongoose';

const SettingsSchema = new Schema<TSettings>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    editor: {
      auto_save: {
        enabled: { type: Boolean, default: true },
        delay: { type: Number, default: 500 },
      },
      font: {
        font_size: {
          type: Number,
          min: [10, 'Minimum acceptable font size is 10'],
          max: [50, 'Maximum acceptable font size is 50'],
          default: 16,
        },
        line_height: {
          type: Number,
          min: [1, 'Minimum acceptable font height is 1'],
          max: [5, 'Maximum acceptable font height is 5'],
          default: 1.6,
        },
        font_family: {
          type: String,
          maxlength: [128, 'Reached max input values for font ily names'],
          minlength: [3, 'Please use a valid font family names'],
          default:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
        font_weight: {
          type: Number,
          default: 400,
          enum: [400, 500, 600, 700, 800],
        },
        writing_diretion: {
          type: String,
          default: 'left to right',
          enum: ['right to left', 'left to right'],
        },
      },
      editing: {
        line_numbers: { type: Boolean, default: false },
        enable_toolbar: { type: Boolean, default: true },
        tab_size: { type: Number, default: 2 },
        enable_relative_line_numbers: { type: Boolean, default: false },
        highlight_active_line: { type: Boolean, default: false },
      },
    },
    theme: {
      main_theme: {
        type: String,
        default: 'light',
        enum: ['light', 'dark'],
      },
      editor_theme: {
        type: String,
        default: 'github-theme',
        enum: ['github-theme'],
      },
      previewer_theme: {
        type: String,
        default: 'github-theme',
        enum: ['github-theme'],
      },
      automatic_ui_theme: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const Settings = model('Settings', SettingsSchema);
export default Settings;
