import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import './App.css';

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function StartScreen({ onStart }) {
    return (
        <div className="quiz-container">
            <div className="quiz-box">
                <h1 className="start-title">Wheel of Health</h1>
                <p className="start-subtitle">
                    Welcome to the DIIREN Fitness Legion. We're happy to have you onboard. First, let's get you measured up. Take this quiz to receive a personalised report about where your mind and body are at. Use the results of this quiz to identify target areas to work on next.
                When taking the quiz, don't think too hard. Follow your gut, and answer truthfully.
                </p>
                <button className="next-button" onClick={onStart}>
                    Manifest your strength...
                </button>
            </div>
        </div>
    );
}

function QuizScreen({ questions, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedValue, setSelectedValue] = useState(null);

    const currentQuestion = questions[currentIndex];
    const progress = `Question ${currentIndex + 1} of ${questions.length}`;

    const handleSelectValue = (value) => {
        setSelectedValue(value);
    };

    const handleNext = () => {
        if (selectedValue !== null) {
            const finalValue = currentQuestion.flipValue 
                ? (11 - selectedValue) 
                : selectedValue;
            
            const newAnswers = {
                ...answers,
                [currentQuestion.id]: {
                    category: currentQuestion.category,
                    value: finalValue
                }
            };
            
            console.log('Question answered:', {
                questionNum: currentIndex + 1,
                category: currentQuestion.category,
                text: currentQuestion.text.substring(0, 50) + '...',
                selectedValue: selectedValue,
                flipValue: currentQuestion.flipValue,
                finalValue: finalValue,
                flipped: currentQuestion.flipValue ? '🔄 FLIPPED' : '➡️ normal'
            });
            
            console.log('Total answers so far:', Object.keys(newAnswers).length);

            if (currentIndex < questions.length - 1) {
                setAnswers(newAnswers);
                setCurrentIndex(currentIndex + 1);
                setSelectedValue(null);
            } else {
                console.log('FINAL ANSWERS OBJECT:', newAnswers);
                console.log('Total questions answered:', Object.keys(newAnswers).length);
                onComplete(newAnswers);
            }
        }
    };

    return (
        <div className="quiz-container">
            <div className="quiz-box">
                <div className="progress-text">{progress}</div>
                
                <div className="question-container">
                    <div className="question-text">{currentQuestion.text}</div>
                </div>
                
                <div className="buttons-wrapper">
                    <div className="buttons-grid">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <button
                                key={value}
                                className={`option-button ${selectedValue === value ? 'selected' : ''}`}
                                onClick={() => handleSelectValue(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="labels-row">
                    <span>{currentQuestion.lowLabel}</span>
                    <span>{currentQuestion.highLabel}</span>
                </div>

                <button 
                    className="next-button" 
                    onClick={handleNext}
                    disabled={selectedValue === null}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function ResultsScreen({ answers }) {
    const categoryScores = {};
    
    Object.values(answers).forEach(answer => {
        if (!categoryScores[answer.category]) {
            categoryScores[answer.category] = { total: 0, count: 0 };
        }
        categoryScores[answer.category].total += answer.value;
        categoryScores[answer.category].count += 1;
    });

    const radarData = Object.entries(categoryScores).map(([category, data]) => ({
        subject: category,
        score: parseFloat((data.total / data.count).toFixed(1)),
        fullMark: 10
    }));

    const scoresList = [...radarData].sort((a, b) => a.subject.localeCompare(b.subject));
    
    // Debug: Log the radar data
    console.log('Radar Data:', radarData);
    console.log('Number of categories:', radarData.length);
    
    const getScoreClass = (score) => {
        if (score < 3) return 'score-low';
        if (score >= 3 && score < 7) return 'score-medium';
        return 'score-high';
    };

    return (
        <div className="quiz-container">
            <div className="quiz-box">
                <h2 className="results-title">Your Wheel of Health</h2>
                
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={500}>
                        <RadarChart 
                            cx="50%" 
                            cy="50%" 
                            outerRadius="80%" 
                            data={radarData}
                        >
                            <PolarGrid stroke="#e0e0e0" />
                            <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: '#666', fontSize: 11 }}
                            />
                            <PolarRadiusAxis 
                                angle={90} 
                                domain={[0, 10]} 
                                tick={{ fill: '#666', fontSize: 11 }}
                                tickCount={6}
                            />
                            <Radar 
                                name="Score"
                                dataKey="score" 
                                stroke="#3b4252" 
                                fill="#3b4252" 
                                fillOpacity={0.5}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="scores-grid">
                    {scoresList.map(({ subject, score }) => (
                        <div key={subject} className="score-card">
                            <div className={`score-category ${getScoreClass(score)}`}>{subject}</div>
                            <div className={`score-value ${getScoreClass(score)}`}>{score}/10</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [screen, setScreen] = useState('loading');
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load questions from JSON file in public folder
        fetch('/questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load questions.json');
                }
                return response.json();
            })
            .then(questions => {
                if (questions.length === 0) {
                    throw new Error('No valid questions found in JSON');
                }
                
                console.log('✅ Loaded questions:', questions.length);
                console.log('📋 Sample question:', questions[0]);
                console.log('🏷️ All categories:', [...new Set(questions.map(q => q.category))]);
                console.log('🔢 Number of unique categories:', new Set(questions.map(q => q.category)).size);
                
                const shuffled = shuffleArray(questions);
                setQuestions(shuffled);
                setScreen('start');
            })
            .catch(err => {
                console.error('Error loading questions:', err);
                setError(err.message);
                setScreen('error');
            });
    }, []);

    const handleStart = () => {
        setScreen('quiz');
    };

    const handleComplete = (finalAnswers) => {
        setAnswers(finalAnswers);
        setScreen('results');
    };

    if (screen === 'loading') {
        return (
            <div className="app-container">
                <div className="quiz-container">
                    <div className="quiz-box">
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Loading questions...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (screen === 'error') {
        return (
            <div className="app-container">
                <div className="quiz-container">
                    <div className="quiz-box">
                        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
                            <h2 style={{ marginBottom: '16px' }}>Error Loading Quiz</h2>
                            <p>{error}</p>
                            <p style={{ marginTop: '16px', fontSize: '0.875rem', color: '#666' }}>
                                Please ensure questions.json is in the public folder.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            {screen === 'start' && <StartScreen onStart={handleStart} />}
            {screen === 'quiz' && <QuizScreen questions={questions} onComplete={handleComplete} />}
            {screen === 'results' && <ResultsScreen answers={answers} />}
        </div>
    );
}
