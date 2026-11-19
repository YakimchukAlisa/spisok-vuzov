import React, { useState } from 'react';
import axios from 'axios';
import './../css/feedbackForm.css';

export default function FeedbackForm({ vuzName, vuzEmail }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus(null);

        try {
            // 👇 ОТПРАВЛЯЕМ ЗАПРОС НА БЭКЕНД
            await axios.post('http://localhost:8080/api/feedback', {
                name: formData.name,
                contact: formData.email, // На бэкенде ждем поле contact
                message: formData.message,
                vuzName: vuzName
            });

            setStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Очищаем форму

            // Убираем сообщение об успехе через 5 секунд
            setTimeout(() => setStatus(null), 5000);

        } catch (error) {
            console.error("Ошибка отправки:", error);
            setStatus('error');
        } finally {
            setIsSending(false);
        }
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
                            disabled={isSending}
                        />
                        <label className="field__label">От кого (Ваше имя)</label>
                    </div>

                    {/* Поле Email */}
                    <div className="field">
                        <input
                            type="text"
                            name="email"
                            className="field__input"
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSending}
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
                            disabled={isSending}
                        />
                        <label className="field__label">Сообщение</label>
                    </div>

                    {/* Кнопка */}
                    <button type="submit" className="btn btn--green" disabled={isSending}>
                        {isSending ? 'Отправка...' : 'Отправить'}
                    </button>

                    {/* Сообщения об успехе или ошибке */}
                    {status === 'success' && (
                        <p className="text-14r" style={{ color: 'var(--green)', marginTop: '12px', textAlign: 'center' }}>
                            Ваше сообщение успешно отправлено! Мы свяжемся с вами.
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="text-14r" style={{ color: 'red', marginTop: '12px', textAlign: 'center' }}>
                            Произошла ошибка при отправке. Попробуйте позже.
                        </p>
                    )}
                </form>

            </div>
        </div>
    );
}