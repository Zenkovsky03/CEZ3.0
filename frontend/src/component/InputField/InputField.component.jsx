const InputField = ({
    label,
    placeholder,
    name,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false
}) => (
    <label className="field-label">
        <p className="input-label-text">{label}</p>
        <input
            className="form-input"
            placeholder={placeholder}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
        />
    </label>
);

export default InputField;
