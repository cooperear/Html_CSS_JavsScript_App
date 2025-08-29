const FormField = ({ label, type = "text", name, value, onChange }) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} />
    </div>
);

export default FormField;
