import React from 'react';
import InputField from '../../InputField/InputField.component.jsx';
import TextArea from '../../TextArea/TextArea.component.jsx';
import DateField from '../../DateField/DateField.component.jsx';
import PasswordField from '../../PasswordField/PasswordField.component.jsx';
import Button from '../../Button/Button.component.jsx';
import GeneralCheckbox from "../../GeneralCheckbox/GeneralCheckbox.component.jsx";

const CourseForm = ({
                        formData,
                        onChange,
                        showPassword,
                        togglePasswordVisibility,
                        isEditMode = false,
                        onSubmit,
                        teachers = [],
                        assignedTeacherId = '',
                        onTeacherChange
                    }) => {
    return (
        <div className="form-container" onSubmit={onSubmit}>
            <div className="input-group">
                <InputField
                    label="Nazwa kursu"
                    name="name"
                    type="text"
                    placeholder="Wprowadź nazwę kursu"
                    value={formData.name}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="input-group">
                <TextArea
                    label="Opis"
                    name="description"
                    placeholder="Wprowadź opis kursu"
                    value={formData.description}
                    onChange={onChange}
                    rows={3}
                    required
                />
            </div>

            <div className="input-group-row">
                <div className="input-group">
                    <DateField
                        label="Data rozpoczęcia"
                        name="startDate"
                        value={formData.startDate}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="input-group">
                    <DateField
                        label="Data zakończenia"
                        name="endDate"
                        value={formData.endDate}
                        onChange={onChange}
                        required
                    />
                </div>
            </div>

            <div className="input-group">
                <GeneralCheckbox
                    name="isPasswordProtected"
                    label="Zabezpiecz kurs hasłem"
                    checked={formData.isPasswordProtected}
                    onChange={onChange}
                />
            </div>

            {formData.isPasswordProtected && (
                <div className="input-group password-field-wrapper">
                    <PasswordField
                        label="Hasło do kursu"
                        name="password"
                        placeholder="Wprowadź hasło do kursu"
                        value={formData.password}
                        onChange={onChange}
                        showPassword={showPassword}
                        togglePassword={togglePasswordVisibility}
                    />
                </div>
            )}

            {!isEditMode && (
                <div className="input-group">
                    <label className="input-label" htmlFor="teacherId">
                        Prowadzący
                    </label>
                    <select
                        id="teacherId"
                        className="input-field"
                        name="teacherId"
                        value={assignedTeacherId}
                        onChange={onTeacherChange}
                    >
                        <option value="">Bez przypisanego prowadzącego</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {[teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || teacher.username}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {isEditMode && (
                <div className="input-group">
                    <GeneralCheckbox
                        name="archived"
                        label="Archiwizuj kurs"
                        checked={formData.archived}
                        onChange={onChange}
                    />
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                fullWidth
            >
                {isEditMode ? 'Zaktualizuj kurs' : 'Utwórz kurs'}
            </Button>
        </div>
    );
};

export default CourseForm;