const InputField = ({ label, placeholder, name, type = 'text' }) => (
    <label className="field-label">
        <p className="input-label-text">{label}</p>
        <input className="form-input" placeholder={placeholder} type={type} name={name}/>
    </label>
);

export default InputField;
