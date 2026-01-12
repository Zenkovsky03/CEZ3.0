import { Link } from 'react-router-dom';

    const Checkbox = ({ children, linkTo = '#', ...inputProps }) => (
    <label className="checkbox-label">
        <input className="checkbox mt-05" type="checkbox" {...inputProps} />
        <span className="checkbox-text">
            Akceptuję <Link className="form-link" to={linkTo}>{children}</Link>.
        </span>
    </label>
);

export default Checkbox;
