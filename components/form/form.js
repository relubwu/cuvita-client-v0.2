import validator from 'validator';
import * as localePackage from 'locale-package';

const { Store } = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    header: { type: String },
    description: { type: String },
    fields: { type: Array },
    action: { type: String },
    padding: { type: String, value: "30px 40px" }
  },
  observers: {
    fields: function () {
      for (let group of this.data.fields)
        for (let field of group) {
          if (field.value !== undefined) this.setData({ [`value.${field.name}`]: field.value });
          if (field.label !== undefined) this.setData({ [`label.${field.name}`]: field.label });
        }
    }
  },
  lifetimes: {
    attached: function () {
      let { locale } = Store.getState().global;
      this.setData({
        locale
      });
    }
  },
  data: {
    popup: {}
  },
  methods: {
    toggle: function ({ target: { dataset: { name } } }) {
      this.setData({
        [`popup.${ name }`]: !this.data.popup[name]
      });
    },
    confirmPicker: function ({ target: { dataset: { name, values } }, detail }) {
      this.setData({
        [`popup.${ name }`]: !this.data.popup[name],
        [`label.${ name }`]: detail.value,
        [`index.${ name }`]: detail.index,
        [`value.${ name }`]: values[detail.index]
      });
    },
    confirmDateTimePicker: function ({ target: { dataset: { name } }, detail }) {
      this.setData({
        [`popup.${name}`]: !this.data.popup[name],
        [`label.${name}`]: new Date(detail).toLocaleDateString(),
        [`value.${name}`]: detail
      });
    },
    onSubmit: function ({ detail: { value } }) {
      let errors = {};
      for (let group of this.data.fields) {
        for (let field of group) {
          if (field.required && (value[field.name] === null || value[field.name] === undefined || (typeof value[field.name] === 'string' && value[field.name].length === 0))) { 
            this.setData({ [`error.${ field.name }`]: `${ field.label }${ localePackage.required[this.data.locale] }` });
            errors[field.name] = true;
            continue;
          }
          if (field.is === 'email' && !validator.isEmail(value[field.name])) {
            this.setData({ [`error.${field.name}`]: localePackage.email[this.data.locale] });
            errors[field.name] = true;
            continue;
          }
          value[field.name] = value[field.name].trim();
          value[field.name] = validator.escape(value[field.name]);
          if (field.is === 'integer') value[field.name] = validator.toInt(value[field.name]);
          if (field.is === 'email') value[field.name] = validator.normalizeEmail(value[field.name]);
          if (field.is === 'date') value[field.name] = new Date(validator.toInt(value[field.name])).toISOString();
          this.setData({ [`error.${ field.name }`]: "" });
          delete errors[field.name];
        }
      }
      Object.keys(errors).length === 0 && this.triggerEvent('submit', value);
    }
  }
})
