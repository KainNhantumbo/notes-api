import { Schema, model } from 'mongoose';
import type { Settings } from '../types/models';

const SettingsSchema = new Schema<Settings>(
  {
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    editor: {
      auto_save: {
        enabled: { type: Boolean, default: true },
        delay: {
          type: Number,
          default: 500,
          max: [
            20000,
            'Maximum acceptable auto save delay time in milliseconds is 20000'
          ],
          min: [
            300,
            'Minimum acceptable auto save delay time in milliseconds is 300'
          ]
        }
      },
      font: {
        font_size: {
          type: Number,
          min: [10, 'Minimum acceptable font size is 10'],
          max: [50, 'Maximum acceptable font size is 50'],
          default: 16
        },
        line_height: {
          type: Number,
          min: [1, 'Minimum acceptable font height is 1'],
          max: [5, 'Maximum acceptable font height is 5'],
          default: 1.6
        },
        font_family: {
          type: String,
          maxlength: [128, 'Reached max input values for font ily names'],
          minlength: [3, 'Please use a valid font family names'],
          default:
            "Inter, 'SF Display', 'Segoe UI', 'Noto Sans', Roboto, ' Sans', Tahoma, Geneva, Verdana, sans-serif"
        },
        font_weight: {
          type: Number,
          default: 400,
          enum: {
            values: [400, 500, 600, 700, 800],
            message: 'Font weight must be in range of 400 to 800.'
          }
        }
      },
      editing: {
        enable_toolbar: { type: Boolean, default: true }
      }
    },
    theme: {
      scheme: { type: String, default: 'light', enum: ['light', 'dark'] },
      is_automatic: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const Settings = model('Settings', SettingsSchema);
export default Settings;
