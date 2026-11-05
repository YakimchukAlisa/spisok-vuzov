import React, { useState } from 'react';
import './../css/feedbackForm.css';

export default function FeedbackForm({ vuzName, vuzEmail }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет логика отправки на бэкенд
        console.log('Отправлено:', formData);
        alert('Сообщение отправлено!');
    };

    return (
        <div className='form-for-contact'>
            <img src="/form.svg" alt="img"/>
            <div className="feedback-form-container">

                {/* Заголовок "Кому" */}
                <div className="feedback-form__header">
                    <h2 className="text-24b">{vuzName}</h2>
                    <a href={`mailto:${vuzEmail}`} className="text-20r feedback-form__email">
                        {vuzEmail}
                    </a>
                </div>

                <form className="feedback-form" onSubmit={handleSubmit}>

                    {/* Поле "От кого" */}
                    <div className="field">
                        <input
                            type="text"
                            name="name"
                            className="field__input"
                            placeholder=" "
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label className="field__label">От кого (Ваше имя)</label>
                    </div>

                    {/* Поле Email */}
                    <div className="field">
                        <input
                            type="email"
                            name="email"
                            className="field__input"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label className="field__label">Ваш Email или телефон</label>
                    </div>

                    {/* Поле Сообщение (Textarea) */}
                    <div className="field">
                        <textarea
                            name="message"
                            className="field__input field__textarea"
                            placeholder=" "
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                        <label className="field__label">Сообщение</label>
                    </div>

                    {/* Кнопка */}
                    <button type="submit" className="btn btn--green">
                        Отправить
                    </button>
                </form>

            </div>
        </div>
    );
}