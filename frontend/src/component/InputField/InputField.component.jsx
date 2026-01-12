const InputField = ({ label, placeholder, name, type = 'text', required = false }) => (
    <label className="field-label">
        <p className="input-label-text">{label}</p>
        <input className="form-input" placeholder={placeholder} type={type} name={name} required={required} />
    </label>
);

export default InputField;
