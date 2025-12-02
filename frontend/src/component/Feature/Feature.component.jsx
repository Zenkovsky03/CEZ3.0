const Feature = ({ icon, title, description }) => (
    <div className="feature-item">
        <span className="material-symbols-outlined feature-icon">{icon}</span>
        <div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    </div>
);

export default Feature;
