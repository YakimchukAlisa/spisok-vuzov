import React, { useState } from 'react';
import spheresData from '../DATA/spheres.json';
import questionsData from '../DATA/test.json'; 
//import '../css/careerTest.css';

export default function CareerTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [resultSpheres, setResultSpheres] = useState([]);

  // 👇 чтобы нельзя было сохранить один и тот же результат дважды 👇
  const [isSaved, setIsSaved] = useState(false);

  const handleAnswerClick = (sphereId) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: sphereId 
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    const selectedAnswers = Object.values(answers);
    
    if (selectedAnswers.length < questionsData.length) {
      alert(`Вы ответили только на ${selectedAnswers.length} из ${questionsData.length} вопросов. Пожалуйста, ответьте на все вопросы!`);
      return;
    }

    const counters = {};
    spheresData.forEach(sphere => {
      counters[sphere.id] = 0;
    });

    selectedAnswers.forEach(sphereId => {
      if (counters[sphereId] !== undefined) {
        counters[sphereId] += 1;
      }
    });

    const maxScore = Math.max(...Object.values(counters));

    const bestSphereIds = Object.keys(counters)
      .filter(id => counters[id] === maxScore)
      .map(Number); 

    const spheresInfo = spheresData.filter(sphere => bestSphereIds.includes(sphere.id));
    
    setResultSpheres(spheresInfo);
    setIsFinished(true);
    setIsSaved(false); // новый результат — ещё не сохранён
  };

  // 👇 СОХРАНЕНИЕ В МАССИВ + ДАТА И ВРЕМЯ 👇
  const handleSaveToProfile = () => {
    if (isSaved) return;

    const now = new Date();

    const testResult = {
      date: now.toLocaleDateString('ru-RU'),
      time: now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: now.getTime(),
      spheres: resultSpheres.map(s => s.name).join(', '),
      sphereIds: resultSpheres.map(s => s.id)
    };

    // читаем уже сохранённые результаты и дописываем новый
    let existing = [];
    try {
      existing = JSON.parse(localStorage.getItem('careerTestResults') || '[]');
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
    existing.push(testResult);

    localStorage.setItem('careerTestResults', JSON.stringify(existing));

    // чистим устаревший одиночный ключ, чтобы не было путаницы
    localStorage.removeItem('careerTestResult');

    setIsSaved(true);
    alert('Результат теста сохранён в личном кабинете!');
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsFinished(false);
    setResultSpheres([]);
    setIsSaved(false);
  };

  // --- ЭКРАН РЕЗУЛЬТАТА ---
  if (isFinished) {
    return (
      <div className="career-test-result">
        <h2 className="text-32b" style={{ marginBottom: '24px' }}>Тест завершен!</h2>
        
        {resultSpheres.length > 0 ? (
          <div className="result-card">
            <p className="text-20r" style={{ marginBottom: '16px' }}>
              {resultSpheres.length > 1 
                ? "Вам одинаково подходят несколько сфер:" 
                : "Вам больше всего подходит сфера:"}
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              {resultSpheres.map(sphere => (
                <h3 key={sphere.id} className="text-32b" style={{ color: 'var(--green)', margin: '8px 0' }}>
                  {sphere.name}
                </h3>
              ))}
            </div>

            <div style={{ marginBottom: '32px' }}>
              {resultSpheres.map((sphere) => (
                <p key={sphere.id} className="text-16r" style={{ marginBottom: '16px' }}>
                  Рекомендуем обратить внимание на{" "}
                  <a 
                    href={`/sphere/${sphere.id}?type=profession`} 
                    className="result-text-link"
                  >
                    профессии
                  </a>{" "}
                  и{" "}
                  <a 
                    href={`/sphere/${sphere.id}?type=specialty`} 
                    className="result-text-link"
                  >
                    специальности
                  </a>{" "}
                  в области «{sphere.name}».
                </p>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              
              {/* Кнопка Сохранить — блокируется после сохранения */}
              <button 
                onClick={handleSaveToProfile} 
                className="btn btn--green-outline"
                disabled={isSaved}
                style={isSaved ? { opacity: 0.6, cursor: 'default' } : undefined}
              >
                {isSaved ? 'Сохранено ✓' : 'Сохранить в профиль'}
              </button>

              <button onClick={handleRestart} className="btn btn--green">
                Пройти заново
              </button>
              
            </div>
          </div>
        ) : (
          <p className="text-20r">Не удалось определить сферу. Попробуйте еще раз.</p>
        )}
      </div>
    );
  }

  // --- ЭКРАН ТЕСТА ---
  const question = questionsData[currentQuestion];
  const currentAnswer = answers[currentQuestion]; 

  return (
    <div className="career-test-wrapper">
      
      <div className="career-test-sidebar">
        <h2 className="career-test-title">
          Пройди тест и узнай, какая профессия тебе подходит
        </h2>
        
        <div className="career-test-steps">
          {questionsData.map((q, index) => {
            const isAnswered = answers[index] !== undefined;
            const isCurrent = index === currentQuestion;

            return (
              <div 
                key={q.id} 
                className={`step-circle ${isAnswered ? 'step-circle--answered' : ''} ${isCurrent ? 'step-circle--current' : ''}`}
                onClick={() => setCurrentQuestion(index)}
                style={{ cursor: 'pointer' }}
              >
                {index + 1}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button 
            className="btn btn--green" 
            style={{ width: '100%' }}
            onClick={handleFinish}
          >
            Завершить тест
          </button>
        </div>
      </div>

      <div className="career-test-content">
        <div className="question-header">
          <span className="question-number">Вопрос {currentQuestion + 1} из {questionsData.length}</span>
          <h3 className="text-28sm">{question.question}</h3>
        </div>

        <div className="question-options">
          {question.options.map((option, idx) => {
            const isSelected = currentAnswer === option.sphereId;

            return (
              <button 
                key={idx}
                className={`option-btn text-16r ${isSelected ? 'option-btn--selected' : ''}`}
                onClick={() => handleAnswerClick(option.sphereId)}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '32px' }}>
          
          {currentQuestion > 0 ? (
            <button className="btn btn--green" onClick={handlePrev}>
              Назад
            </button>
          ) : (
            <div></div> 
          )}

          {currentQuestion < questionsData.length - 1 && (
            <button className="btn btn--green" onClick={handleNext}>
              Далее
            </button>
          )}
        </div>
      </div>

    </div>
  );
}