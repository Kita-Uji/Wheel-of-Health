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
                    Discover your health strengths and areas for growth across 10 key dimensions. 
                    This assessment takes about 5 minutes to complete.
                </p>
                <button className="next-button" onClick={onStart}>
                    Start Assessment
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
    const progressPercentage = Math.round((currentIndex / questions.length) * 100);

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
                <div className="progress-container">
                    <div className="progress-bar-bg">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="progress-percentage">{progressPercentage}% complete</div>
                </div>
                
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

function ResultsScreen({ answers, descriptions }) {
    const [openDropdowns, setOpenDropdowns] = useState({});
    
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

    // Sort by score (highest to lowest)
    const scoresList = [...radarData].sort((a, b) => b.score - a.score);
    
    // Debug: Log the radar data
    console.log('Radar Data:', radarData);
    console.log('Number of categories:', radarData.length);
    
    const getScoreClass = (score) => {
        if (score < 3) return 'score-low';
        if (score >= 3 && score < 7) return 'score-medium';
        return 'score-high';
    };
    
    const getScoreLabel = (score) => {
        if (score < 3) return 'Constraint';
        if (score >= 3 && score < 7) return 'Moderate';
        return 'Strong';
    };
    
    const toggleDropdown = (category) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
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

                <div className="scores-accordion">
                    <div className="accordion-subtitle">Ranked from strongest to weakest.</div>
                    {scoresList.map(({ subject, score }) => (
                        <div key={subject} className="accordion-item">
                            <div 
                                className="accordion-header"
                                onClick={() => toggleDropdown(subject)}
                            >
                                <div className="accordion-header-left">
                                    <span className={`score-dot ${getScoreClass(score)}`}></span>
                                    <span className="accordion-title">{subject}</span>
                                    <span className="accordion-score">{score} / 10</span>
                                </div>
                                <div className="accordion-header-right">
                                    <span className={`accordion-label ${getScoreClass(score)}`}>
                                        {getScoreLabel(score)}
                                    </span>
                                    <span className={`accordion-arrow ${openDropdowns[subject] ? 'open' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                            </div>
                            {openDropdowns[subject] && (
                                <div 
                                    className="accordion-content"
                                    dangerouslySetInnerHTML={{ __html: descriptions[subject] || '<p>Description coming soon.</p>' }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="next-steps-container">
                    <a 
                        href="https://diirenfitness.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="next-steps-button"
                    >
                        Get Your Next Steps
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const [screen, setScreen] = useState('loading');
    const [questions, setQuestions] = useState([]);
    const [descriptions, setDescriptions] = useState({});
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load questions
        fetch('/questions.json')
            .then(res => res.json())
            .then(async (questionsData) => {
                if (questionsData.length === 0) {
                    throw new Error('No valid questions found in JSON');
                }
                
                console.log('✅ Loaded questions:', questionsData.length);
                console.log('📋 Sample question:', questionsData[0]);
                
                // Get unique categories
                const categories = [...new Set(questionsData.map(q => q.category))];
                console.log('🏷️ All categories:', categories);
                console.log('🔢 Number of unique categories:', categories.length);
                
                // Load HTML description files for each category
                const descriptionsData = {};
                for (const category of categories) {
                    try {
                        const response = await fetch(`/descriptions/${category}.html`);
                        if (response.ok) {
                            // Load HTML exactly as written - no modification
                            descriptionsData[category] = await response.text();
                        }
                    } catch (err) {
                        console.warn(`Could not load description for ${category}`);
                    }
                }
                
                console.log('📝 Loaded descriptions for', Object.keys(descriptionsData).length, 'categories');
                
                const shuffled = shuffleArray(questionsData);
                setQuestions(shuffled);
                setDescriptions(descriptionsData);
                setScreen('start');
            })
            .catch(err => {
                console.error('Error loading data:', err);
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
            {screen === 'results' && <ResultsScreen answers={answers} descriptions={descriptions} />}
        </div>
    );
}
