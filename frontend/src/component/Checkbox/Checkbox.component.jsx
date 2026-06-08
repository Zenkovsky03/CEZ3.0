import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Checkbox = ({ children, linkTo = '#', ...inputProps }) => {
    const { t } = useTranslation();
    return (
        <label className="checkbox-label">
            <input className="checkbox mt-05" type="checkbox" {...inputProps} />
            <span className="checkbox-text">
                {t('auth.accept_terms')} <Link className="form-link" to={linkTo}>{children}</Link>.
            </span>
        </label>
    );
};

export default Checkbox;
