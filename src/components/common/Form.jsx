import CIcon from "@coreui/icons-react";
import {
  CButton,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInvalidFeedback,
  CLabel,
  CSelect,
  CSpinner,
  CTextarea,
} from "@coreui/react";
import Joi from "joi";
import _ from "lodash";
import { Component } from "react";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    btnDisable: false,
    spinner: false,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const error = this.validate();
    if (!error) {
      this.callServer();
    } else {
      const btnDisable = true;
      const errors = error;
      this.setState({ errors, btnDisable });
    }
  };

  validate = () => {
    const result = Joi.object(this.schema)
      .options({ abortEarly: false })
      .validate(this.state.data);
    if (result.error) {
      const errors = {};
      result.error.details.map((each) => {
        _.set(
          errors,
          _.join(each.path, "."),
          each.message.replace('"', "").replace('"', "")
        );
      });
      return errors;
    }
    return null;
  };

  handleChange = ({ currentTarget: input }) => {
    const { name, value } = input;
    const data = { ...this.state.data };
    data[name] = value;
    const error = this.validateProperty(name, value);
    const errors = { ...this.state.errors };
    error ? (errors[name] = error) : delete errors[name];
    let btnDisable = true;
    if (Object.keys(errors).length === 0) {
      btnDisable = false;
    }
    this.setState({ data, errors, btnDisable });
  };

  validateProperty = (name, value) => {
    const schema = {
      [name]: this.schema[name],
    };
    const data = { [name]: value };
    const result = Joi.object(schema).validate(data);
    return result.error
      ? result.error.details[0].message.replace('"', "").replace('"', "")
      : null;
  };

  renderInput = (name, label, type, others = {}, hidden = false) => {
    const { data, errors } = this.state;
    return (
      <CFormGroup hidden={hidden}>
        <CLabel htmlFor={name}>{label}</CLabel>
        <CInput
          type={type}
          id={name}
          name={name}
          onChange={this.handleChange}
          value={data[name]}
          invalid={errors[name] ? true : false}
          {...others}
        />
        <CInvalidFeedback>{errors[name]}</CInvalidFeedback>
      </CFormGroup>
    );
  };

  renderInputGroup = (
    name,
    type,
    placeholder,
    iconName,
    others = {},
    hidden = false
  ) => {
    const { data, errors } = this.state;
    return (
      <CFormGroup hidden={hidden} className="mb-3">
        <CInputGroup>
          <CInputGroupPrepend>
            <CInputGroupText>
              <CIcon name={iconName} />
            </CInputGroupText>
          </CInputGroupPrepend>
          <CInput
            type={type}
            id={name}
            name={name}
            onChange={this.handleChange}
            value={data[name]}
            invalid={errors[name] ? true : false}
            placeholder={placeholder}
            {...others}
          />
          <CInvalidFeedback>{errors[name]}</CInvalidFeedback>
        </CInputGroup>
      </CFormGroup>
    );
  };

  renderSelectGroup = (
    name,
    placeholder,
    iconName,
    options,
    others = {},
    hidden = false
  ) => {
    const { data, errors } = this.state;
    return (
      <CFormGroup hidden={hidden} className="mb-3">
        <CInputGroup>
          <CInputGroupPrepend>
            <CInputGroupText>
              <CIcon name={iconName} />
            </CInputGroupText>
          </CInputGroupPrepend>
          <CSelect
            custom
            name={name}
            id={name}
            value={data[name]}
            onChange={this.handleChange}
            invalid={errors[name] ? true : false}
            {...others}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options
              ? options.map((option, index) => {
                  return (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  );
                })
              : ""}
          </CSelect>
          <CInvalidFeedback>{errors[name]}</CInvalidFeedback>
        </CInputGroup>
      </CFormGroup>
    );
  };

  renderSelect = (name, label, options, others = {}, hidden = false) => {
    const { data, errors } = this.state;
    return (
      <CFormGroup hidden={hidden}>
        <CLabel htmlFor={name}>{label}</CLabel>
        <CSelect
          custom
          name={name}
          id={name}
          value={data[name]}
          onChange={this.handleChange}
          invalid={errors[name] ? true : false}
          {...others}
        >
          <option value="" disabled hidden>
            Choose here..
          </option>
          {options
            ? options.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })
            : ""}
        </CSelect>
        <CInvalidFeedback>{errors[name]}</CInvalidFeedback>
      </CFormGroup>
    );
  };

  renderTextArea(name, label, rows, others = {}, hidden = false) {
    const { data, errors } = this.state;
    return (
      <CFormGroup hidden={hidden}>
        <CLabel htmlFor={name}>{label}</CLabel>
        <CTextarea
          rows={rows}
          id={name}
          name={name}
          onChange={this.handleChange}
          value={data[name]}
          invalid={errors[name] ? true : false}
          {...others}
        />
        <CInvalidFeedback>{errors[name]}</CInvalidFeedback>
      </CFormGroup>
    );
  }

  renderButton = (label, btnColor, spinnerColor, others = {}) => {
    return (
      <CButton
        disabled={this.state.btnDisable && (this.validate() ? true : false)}
        type="submit"
        color={this.state.btnDisable ? "secondary" : btnColor}
        {...others}
      >
        <CSpinner hidden={!this.state.spinner} color={spinnerColor} size="sm" />{" "}
        {label}
      </CButton>
    );
  };
}

export default Form;
