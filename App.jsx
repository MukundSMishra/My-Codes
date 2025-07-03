import React, { useState, useEffect } from 'react';

// Assuming ConfirmationModal.js is in the same directory or a components folder
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto">
                <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};


const App = () => {
    const [activeTab, setActiveTab] = useState('subjects');
    const [activeQuestionSubTab, setActiveQuestionSubTab] = useState('prelims'); // 'prelims' or 'mains'
    const [activeQuizSubTab, setActiveQuizSubTab] = useState('prelimQuiz'); // 'prelimQuiz' or 'mainsQuiz'

    // State for Subjects
    const [subjects, setSubjects] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [editingSubject, setEditingSubject] = useState(null); // null or subject object

    // State for Chapters
    const [chapters, setChapters] = useState([]);
    const [newChapterName, setNewChapterName] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [editingChapter, setEditingChapter] = useState(null); // null or chapter object
    const [filterSubjectId, setFilterSubjectId] = useState(''); // For filtering chapters

    // State for Topics
    const [topics, setTopics] = useState([]);
    const [newTopicName, setNewTopicName] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [editingTopic, setEditingTopic] = useState(null); // null or topic object
    const [filterTopicSubjectId, setFilterTopicSubjectId] = useState(''); // For filtering topics
    const [filterTopicChapterId, setFilterTopicChapterId] = useState(''); // For filtering topics

    // State for Questions (Prelims - formerly MCQ)
    const [prelimQuestions, setPrelimQuestions] = useState([]); // Renamed from mcqQuestions
    const [newPrelimQuestionText, setNewPrelimQuestionText] = useState('');
    const [newPrelimQuestionOptions, setNewPrelimQuestionOptions] = useState([{ text: '', weightage: 0 }, { text: '', weightage: 0 }, { text: '', weightage: 0 }, { text: '', weightage: 0 }]); // Added weightage
    const [newPrelimQuestionCorrectAnswer, setNewPrelimQuestionCorrectAnswer] = useState('');
    const [newPrelimQuestionDifficulty, setNewPrelimQuestionDifficulty] = useState('Easy');
    const [newPrelimQuestionMarks, setNewPrelimQuestionMarks] = useState(1);
    const [selectedPrelimSubjectId, setSelectedPrelimSubjectId] = useState('');
    const [selectedPrelimChapterId, setSelectedPrelimChapterId] = useState('');
    const [selectedPrelimTopicId, setSelectedPrelimTopicId] = useState('');
    const [editingPrelimQuestion, setEditingPrelimQuestion] = useState(null);

    // State for Questions (Mains - formerly Text)
    const [mainsQuestions, setMainsQuestions] = useState([]); // Renamed from textQuestions
    const [newMainsQuestionText, setNewMainsQuestionText] = useState('');
    const [newMainsQuestionDifficulty, setNewMainsQuestionDifficulty] = useState('Easy');
    const [newMainsQuestionMarks, setNewMainsQuestionMarks] = useState(5);
    const [selectedMainsSubjectId, setSelectedMainsSubjectId] = useState('');
    const [selectedMainsChapterId, setSelectedMainsChapterId] = useState('');
    const [selectedMainsTopicId, setSelectedMainsTopicId] = useState('');
    const [editingMainsQuestion, setEditingMainsQuestion] = useState(null);

    // State for Planners
    const [planners, setPlanners] = useState([]);
    const [newPlannerName, setNewPlannerName] = useState('');
    const [newPlannerDescription, setNewPlannerDescription] = useState('');
    const [tempSelectedPlannerChapters, setTempSelectedPlannerChapters] = useState([]); // Chapter IDs for new planner
    const [editingPlanner, setEditingPlanner] = useState(null);

    // State for Quiz
    const [quizzes, setQuizzes] = useState([]);
    const [newQuizName, setNewQuizName] = useState('');
    const [newQuizDescription, setNewQuizDescription] = useState('');
    const [tempSelectedQuestionIds, setTempSelectedQuestionIds] = useState([]); // Question IDs for current quiz being built
    const [quizAccumulatedQuestions, setQuizAccumulatedQuestions] = useState([]); // Questions actually added to quiz

    // Confirmation Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => () => { });


    // Load data from localStorage on mount
    useEffect(() => {
        const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
        setSubjects(storedSubjects);
        const storedChapters = JSON.parse(localStorage.getItem('chapters')) || [];
        setChapters(storedChapters);
        const storedTopics = JSON.parse(localStorage.getItem('topics')) || [];
        setTopics(storedTopics);
        // Update to load prelimQuestions and mainsQuestions
        const storedPrelimQuestions = JSON.parse(localStorage.getItem('prelimQuestions')) || [];
        setPrelimQuestions(storedPrelimQuestions);
        const storedMainsQuestions = JSON.parse(localStorage.getItem('mainsQuestions')) || [];
        setMainsQuestions(storedMainsQuestions);
        const storedPlanners = JSON.parse(localStorage.getItem('planners')) || [];
        setPlanners(storedPlanners);
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        setQuizzes(storedQuizzes);
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('chapters', JSON.stringify(chapters));
    }, [chapters]);

    useEffect(() => {
        localStorage.setItem('topics', JSON.stringify(topics));
    }, [topics]);

    useEffect(() => {
        // Renamed from mcqQuestions
        localStorage.setItem('prelimQuestions', JSON.stringify(prelimQuestions));
    }, [prelimQuestions]);

    useEffect(() => {
        // Renamed from textQuestions
        localStorage.setItem('mainsQuestions', JSON.stringify(mainsQuestions));
    }, [mainsQuestions]);

    useEffect(() => {
        localStorage.setItem('planners', JSON.stringify(planners));
    }, [planners]);

    useEffect(() => {
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }, [quizzes]);

    // --- Utility for reordering lists ---
    const moveItemInList = (list, setList, itemId, direction) => {
        const index = list.findIndex(item => item.id === itemId);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < list.length) {
            const newList = [...list];
            const [removed] = newList.splice(index, 1);
            newList.splice(newIndex, 0, removed);
            setList(newList);
        }
    };


    // --- Subject Handlers ---
    const handleAddSubject = () => {
        if (newSubjectName.trim() === '') {
            alert('Subject name cannot be empty.');
            return;
        }
        if (subjects.some(sub => sub.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
            alert('Subject with this name already exists.');
            return;
        }
        setSubjects([...subjects, { id: Date.now(), name: newSubjectName.trim() }]);
        setNewSubjectName('');
    };

    const handleEditSubject = (subject) => {
        setEditingSubject(subject);
        setNewSubjectName(subject.name);
    };

    const handleUpdateSubject = () => {
        if (newSubjectName.trim() === '') {
            alert('Subject name cannot be empty.');
            return;
        }
        if (subjects.some(sub => sub.id !== editingSubject.id && sub.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
            alert('Subject with this name already exists.');
            return;
        }
        setSubjects(subjects.map(sub =>
            sub.id === editingSubject.id ? { ...sub, name: newSubjectName.trim() } : sub
        ));
        setEditingSubject(null);
        setNewSubjectName('');
    };

    const handleDeleteSubject = (subjectId, subjectName) => {
        setConfirmModalMessage(`Are you sure you want to delete the subject "${subjectName}"? This will also delete all associated chapters, topics, questions, and quizzes.`);
        setConfirmAction(() => () => {
            // Delete associated chapters, topics, questions, and quizzes first
            const chaptersToDelete = chapters.filter(chap => chap.subjectId === subjectId);
            const chapterIdsToDelete = chaptersToDelete.map(chap => chap.id);

            // Filter out affected data
            setChapters(chapters.filter(chap => chap.subjectId !== subjectId));
            setTopics(topics.filter(topic => !chapterIdsToDelete.includes(topic.chapterId)));
            setPrelimQuestions(prelimQuestions.filter(q => q.subjectId !== subjectId));
            setMainsQuestions(mainsQuestions.filter(q => q.subjectId !== subjectId));

            // Also filter quizzes if they contain questions from this subject
            setQuizzes(prevQuizzes => prevQuizzes.map(quiz => ({
                ...quiz,
                questionDetails: quiz.questionDetails.filter(q => q.subjectId !== subjectId)
            })).filter(quiz => quiz.questionDetails.length > 0)); // Remove quizzes with no questions left

            setSubjects(subjects.filter(sub => sub.id !== subjectId));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };


    // --- Chapter Handlers ---
    const handleAddChapter = () => {
        if (newChapterName.trim() === '' || selectedSubjectId === '') {
            alert('Chapter name and subject must be selected.');
            return;
        }
        if (chapters.some(chap => chap.name.toLowerCase() === newChapterName.trim().toLowerCase() && chap.subjectId === selectedSubjectId)) {
            alert('Chapter with this name already exists in this subject.');
            return;
        }
        setChapters([...chapters, { id: Date.now(), name: newChapterName.trim(), subjectId: selectedSubjectId }]);
        setNewChapterName('');
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setNewChapterName(chapter.name);
        setSelectedSubjectId(chapter.subjectId);
    };

    const handleUpdateChapter = () => {
        if (newChapterName.trim() === '' || selectedSubjectId === '') {
            alert('Chapter name and subject must be selected.');
            return;
        }
        if (chapters.some(chap => chap.id !== editingChapter.id && chap.name.toLowerCase() === newChapterName.trim().toLowerCase() && chap.subjectId === selectedSubjectId)) {
            alert('Chapter with this name already exists in this subject.');
            return;
        }
        setChapters(chapters.map(chap =>
            chap.id === editingChapter.id ? { ...chap, name: newChapterName.trim(), subjectId: selectedSubjectId } : chap
        ));
        setEditingChapter(null);
        setNewChapterName('');
        setSelectedSubjectId('');
    };

    const handleDeleteChapter = (chapterId, chapterName) => {
        setConfirmModalMessage(`Are you sure you want to delete the chapter "${chapterName}"? This will also delete all associated topics, questions, and quizzes containing questions from this chapter.`);
        setConfirmAction(() => () => {
            // Delete associated topics and questions first
            setTopics(topics.filter(topic => topic.chapterId !== chapterId));
            setPrelimQuestions(prelimQuestions.filter(q => q.chapterId !== chapterId));
            setMainsQuestions(mainsQuestions.filter(q => q.chapterId !== chapterId));

            // Also filter quizzes if they contain questions from this chapter
            setQuizzes(prevQuizzes => prevQuizzes.map(quiz => ({
                ...quiz,
                questionDetails: quiz.questionDetails.filter(q => q.chapterId !== chapterId)
            })).filter(quiz => quiz.questionDetails.length > 0)); // Remove quizzes with no questions left

            setChapters(chapters.filter(chap => chap.id !== chapterId));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };


    const filteredChapters = filterSubjectId
        ? chapters.filter(chapter => chapter.subjectId === filterSubjectId)
        : chapters;

    // --- Topic Handlers ---
    const handleAddTopic = () => {
        if (newTopicName.trim() === '' || selectedSubjectId === '' || selectedChapterId === '') {
            alert('Topic name, subject, and chapter must be selected.');
            return;
        }
        if (topics.some(topic => topic.name.toLowerCase() === newTopicName.trim().toLowerCase() && topic.chapterId === selectedChapterId)) {
            alert('Topic with this name already exists in this chapter.');
            return;
        }
        setTopics([...topics, { id: Date.now(), name: newTopicName.trim(), subjectId: selectedSubjectId, chapterId: selectedChapterId }]);
        setNewTopicName('');
    };

    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setNewTopicName(topic.name);
        setSelectedSubjectId(topic.subjectId);
        setSelectedChapterId(topic.chapterId);
    };

    const handleUpdateTopic = () => {
        if (newTopicName.trim() === '' || selectedSubjectId === '' || selectedChapterId === '') {
            alert('Topic name, subject, and chapter must be selected.');
            return;
        }
        if (topics.some(topic => topic.id !== editingTopic.id && topic.name.toLowerCase() === newTopicName.trim().toLowerCase() && topic.chapterId === selectedChapterId)) {
            alert('Topic with this name already exists in this chapter.');
            return;
        }
        setTopics(topics.map(topic =>
            topic.id === editingTopic.id ? { ...topic, name: newTopicName.trim(), subjectId: selectedSubjectId, chapterId: selectedChapterId } : topic
        ));
        setEditingTopic(null);
        setNewTopicName('');
        setSelectedSubjectId('');
        setSelectedChapterId('');
    };

    const handleDeleteTopic = (topicId, topicName) => {
        setConfirmModalMessage(`Are you sure you want to delete the topic "${topicName}"? This will also delete any associated questions.`);
        setConfirmAction(() => () => {
            setPrelimQuestions(prelimQuestions.filter(q => q.topicId !== topicId));
            setMainsQuestions(mainsQuestions.filter(q => q.topicId !== topicId));
            setTopics(topics.filter(topic => topic.id !== topicId));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const filteredTopics = topics.filter(topic =>
        (filterTopicSubjectId === '' || topic.subjectId === filterTopicSubjectId) &&
        (filterTopicChapterId === '' || topic.chapterId === filterTopicChapterId)
    );

    const getChaptersForSelectedSubject = (subjId) => {
        return chapters.filter(chapter => chapter.subjectId === subjId);
    };

    // --- Question Handlers (Prelims - formerly MCQ) ---
    const handleAddPrelimQuestion = () => {
        if (newPrelimQuestionText.trim() === '' || newPrelimQuestionOptions.some(opt => opt.text.trim() === '') || newPrelimQuestionCorrectAnswer.trim() === '' || selectedPrelimSubjectId === '' || selectedPrelimChapterId === '') {
            alert('All Prelim question fields (text, options, correct answer, subject, chapter) must be filled, and options must have text.');
            return;
        }

        const newQuestion = {
            id: Date.now(),
            questionTypeCategory: 'Prelims',
            questionText: newPrelimQuestionText.trim(),
            options: newPrelimQuestionOptions.map(opt => ({ text: opt.text.trim(), weightage: Number(opt.weightage) })), // Store text and weightage
            correctAnswer: newPrelimQuestionCorrectAnswer.trim(),
            questionDifficulty: newPrelimQuestionDifficulty,
            questionMarks: newPrelimQuestionMarks,
            subjectId: selectedPrelimSubjectId,
            chapterId: selectedPrelimChapterId,
            topicId: selectedPrelimTopicId || null // Optional topic
        };
        setPrelimQuestions([...prelimQuestions, newQuestion]);
        resetPrelimForm();
    };

    const handleEditPrelimQuestion = (question) => {
        setEditingPrelimQuestion(question);
        setNewPrelimQuestionText(question.questionText);
        // Ensure options have weightage property when editing older questions
        const optionsWithWeightage = question.options.map(opt =>
            typeof opt === 'string' ? { text: opt, weightage: 0 } : opt
        );
        setNewPrelimQuestionOptions(optionsWithWeightage);
        setNewPrelimQuestionCorrectAnswer(question.correctAnswer);
        setNewPrelimQuestionDifficulty(question.questionDifficulty);
        setNewPrelimQuestionMarks(question.questionMarks);
        setSelectedPrelimSubjectId(question.subjectId);
        setSelectedPrelimChapterId(question.chapterId);
        setSelectedPrelimTopicId(question.topicId || '');
    };

    const handleUpdatePrelimQuestion = () => {
        if (newPrelimQuestionText.trim() === '' || newPrelimQuestionOptions.some(opt => opt.text.trim() === '') || newPrelimQuestionCorrectAnswer.trim() === '' || selectedPrelimSubjectId === '' || selectedPrelimChapterId === '') {
            alert('All Prelim question fields must be filled, and options must have text.');
            return;
        }

        setPrelimQuestions(prelimQuestions.map(q =>
            q.id === editingPrelimQuestion.id
                ? {
                    ...q,
                    questionText: newPrelimQuestionText.trim(),
                    options: newPrelimQuestionOptions.map(opt => ({ text: opt.text.trim(), weightage: Number(opt.weightage) })), // Store text and weightage
                    correctAnswer: newPrelimQuestionCorrectAnswer.trim(),
                    questionDifficulty: newPrelimQuestionDifficulty,
                    questionMarks: newPrelimQuestionMarks,
                    subjectId: selectedPrelimSubjectId,
                    chapterId: selectedPrelimChapterId,
                    topicId: selectedPrelimTopicId || null
                }
                : q
        ));
        setEditingPrelimQuestion(null);
        resetPrelimForm();
    };

    const handleDeleteQuestion = (questionId, questionText, questionType) => {
        setConfirmModalMessage(`Are you sure you want to delete the ${questionType} question: "${questionText}"? This will also remove it from any quizzes.`);
        setConfirmAction(() => () => {
            if (questionType === 'Prelims') { // Renamed from MCQ
                setPrelimQuestions(prelimQuestions.filter(q => q.id !== questionId));
            } else if (questionType === 'Mains') { // Renamed from Text
                setMainsQuestions(mainsQuestions.filter(q => q.id !== questionId));
            }
            // Remove question from any quizzes it's part of
            setQuizzes(prevQuizzes => prevQuizzes.map(quiz => ({
                ...quiz,
                questionDetails: quiz.questionDetails.filter(q => q.id !== questionId)
            })).filter(quiz => quiz.questionDetails.length > 0)); // Remove quizzes with no questions left
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const resetPrelimForm = () => {
        setNewPrelimQuestionText('');
        setNewPrelimQuestionOptions([{ text: '', weightage: 0 }, { text: '', weightage: 0 }, { text: '', weightage: 0 }, { text: '', weightage: 0 }]);
        setNewPrelimQuestionCorrectAnswer('');
        setNewPrelimQuestionDifficulty('Easy');
        setNewPrelimQuestionMarks(1);
        setSelectedPrelimSubjectId('');
        setSelectedPrelimChapterId('');
        setSelectedPrelimTopicId('');
    };

    const handlePrelimOptionChange = (index, field, value) => {
        const updatedOptions = [...newPrelimQuestionOptions];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        setNewPrelimQuestionOptions(updatedOptions);
    };

    const getTopicsForSelectedChapter = (chapId) => {
        return topics.filter(topic => topic.chapterId === chapId);
    };

    // --- Question Handlers (Mains - formerly Text) ---
    const handleAddMainsQuestion = () => {
        if (newMainsQuestionText.trim() === '' || selectedMainsSubjectId === '' || selectedMainsChapterId === '') {
            alert('All Mains question fields (text, subject, chapter) must be filled.');
            return;
        }

        const newQuestion = {
            id: Date.now(),
            questionTypeCategory: 'Mains',
            questionText: newMainsQuestionText.trim(),
            questionDifficulty: newMainsQuestionDifficulty,
            questionMarks: newMainsQuestionMarks,
            subjectId: selectedMainsSubjectId,
            chapterId: selectedMainsChapterId,
            topicId: selectedMainsTopicId || null // Optional topic
        };
        setMainsQuestions([...mainsQuestions, newQuestion]);
        resetMainsForm();
    };

    const handleEditMainsQuestion = (question) => {
        setEditingMainsQuestion(question);
        setNewMainsQuestionText(question.questionText);
        setNewMainsQuestionDifficulty(question.questionDifficulty);
        setNewMainsQuestionMarks(question.questionMarks);
        setSelectedMainsSubjectId(question.subjectId);
        setSelectedMainsChapterId(question.chapterId);
        setSelectedMainsTopicId(question.topicId || '');
    };

    const handleUpdateMainsQuestion = () => {
        if (newMainsQuestionText.trim() === '' || selectedMainsSubjectId === '' || selectedMainsChapterId === '') {
            alert('All Mains question fields must be filled.');
            return;
        }

        setMainsQuestions(mainsQuestions.map(q =>
            q.id === editingMainsQuestion.id
                ? {
                    ...q,
                    questionText: newMainsQuestionText.trim(),
                    questionDifficulty: newMainsQuestionDifficulty,
                    questionMarks: newMainsQuestionMarks,
                    subjectId: selectedMainsSubjectId,
                    chapterId: selectedMainsChapterId,
                    topicId: selectedMainsTopicId || null
                }
                : q
        ));
        setEditingMainsQuestion(null);
        resetMainsForm();
    };

    const resetMainsForm = () => {
        setNewMainsQuestionText('');
        setNewMainsQuestionDifficulty('Easy');
        setSelectedMainsSubjectId('');
        setSelectedMainsChapterId('');
        setSelectedMainsTopicId('');
    };


    // --- Planner Handlers ---
    const handleAddPlanner = () => {
        if (!newPlannerName.trim()) {
            alert('Planner name cannot be empty.');
            return;
        }
        if (tempSelectedPlannerChapters.length === 0) {
            alert('At least one chapter must be selected for the planner.');
            return;
        }

        const selectedChapterDetails = tempSelectedPlannerChapters.map(chapterId => {
            const chapter = chapters.find(c => c.id === chapterId);
            const subject = subjects.find(s => s.id === chapter.subjectId);
            return {
                chapterId: chapter.id,
                chapterName: chapter.name,
                subjectId: subject.id,
                subjectName: subject.name,
            };
        });

        const newPlanner = {
            id: Date.now(),
            name: newPlannerName.trim(),
            description: newPlannerDescription.trim(),
            chapters: selectedChapterDetails,
        };

        setPlanners([...planners, newPlanner]);
        setNewPlannerName('');
        setNewPlannerDescription('');
        setTempSelectedPlannerChapters([]);
    };

    const handleEditPlanner = (planner) => {
        setEditingPlanner(planner);
        setNewPlannerName(planner.name);
        setNewPlannerDescription(planner.description);
        setTempSelectedPlannerChapters(planner.chapters.map(c => c.chapterId));
    };

    const handleUpdatePlanner = () => {
        if (!newPlannerName.trim()) {
            alert('Planner name cannot be empty.');
            return;
        }
        if (tempSelectedPlannerChapters.length === 0) {
            alert('At least one chapter must be selected for the planner.');
            return;
        }

        const updatedChapterDetails = tempSelectedPlannerChapters.map(chapterId => {
            const chapter = chapters.find(c => c.id === chapterId);
            const subject = subjects.find(s => s.id === chapter.subjectId);
            return {
                chapterId: chapter.id,
                chapterName: chapter.name,
                subjectId: subject.id,
                subjectName: subject.name,
            };
        });

        setPlanners(planners.map(planner =>
            planner.id === editingPlanner.id
                ? {
                    ...planner,
                    name: newPlannerName.trim(),
                    description: newPlannerDescription.trim(),
                    chapters: updatedChapterDetails,
                }
                : planner
        ));
        setEditingPlanner(null);
        setNewPlannerName('');
        setNewPlannerDescription('');
        setTempSelectedPlannerChapters([]);
    };

    const handleDeletePlanner = (plannerId, plannerName) => {
        setConfirmModalMessage(`Are you sure you want to delete the planner "${plannerName}"?`);
        setConfirmAction(() => () => {
            setPlanners(planners.filter(planner => planner.id !== plannerId));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    const handleTempPlannerChapterCheckboxChange = (chapterId) => {
        setTempSelectedPlannerChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    // --- Quiz Handlers ---
    const handleTempQuestionCheckboxChange = (questionId) => {
        setTempSelectedQuestionIds(prev =>
            prev.includes(questionId)
                ? prev.filter(id => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleAddQuestionsToQuiz = (questionType) => {
        if (tempSelectedQuestionIds.length === 0) {
            alert('Please select at least one question to add to the quiz.');
            return;
        }

        const questionsToAdd = (questionType === 'Prelims' ? prelimQuestions : mainsQuestions).filter(q =>
            tempSelectedQuestionIds.includes(q.id)
        );

        const newQuizQuestions = questionsToAdd.map(q => {
            const subjectName = subjects.find(s => s.id === q.subjectId)?.name || 'Unknown Subject';
            const chapterName = chapters.find(c => c.id === q.chapterId)?.name || 'Unknown Chapter';
            const topicName = topics.find(t => t.id === q.topicId)?.name || 'Unknown Topic';
            return {
                id: q.id,
                questionTypeCategory: q.questionTypeCategory,
                questionText: q.questionText,
                options: q.options, // Only for Prelims
                correctAnswer: q.correctAnswer, // Only for Prelims
                questionDifficulty: q.questionDifficulty,
                questionMarks: q.questionMarks,
                subjectId: q.subjectId,
                subjectName: subjectName,
                chapterId: q.chapterId,
                chapterName: chapterName,
                topicId: q.topicId,
                topicName: topicName,
            };
        });

        // Accumulate questions for the current quiz being built
        setQuizAccumulatedQuestions(prev => {
            const currentIds = new Set(prev.map(q => q.id));
            const uniqueNewQuestions = newQuizQuestions.filter(q => !currentIds.has(q.id));
            return [...prev, ...uniqueNewQuestions];
        });

        // Clear temporary selections
        setTempSelectedQuestionIds([]);
    };

    const handleCreateQuiz = () => {
        if (!newQuizName.trim()) {
            alert('Quiz name cannot be empty.');
            return;
        }
        if (quizAccumulatedQuestions.length === 0) {
            alert('Please add questions to the quiz before creating.');
            return;
        }

        const newQuiz = {
            id: Date.now(),
            name: newQuizName.trim(),
            description: newQuizDescription.trim(),
            questionDetails: quizAccumulatedQuestions, // Store the detailed questions
            createdAt: new Date().toISOString(),
        };

        setQuizzes([...quizzes, newQuiz]);
        setNewQuizName('');
        setNewQuizDescription('');
        setQuizAccumulatedQuestions([]);
    };

    const handleDeleteQuiz = (quizId, quizName) => {
        setConfirmModalMessage(`Are you sure you want to delete the quiz "${quizName}"?`);
        setConfirmAction(() => () => {
            setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'subjects':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Subjects</h2>

                        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                            </h3>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { // Modified for Change 01
                                            if (editingSubject) {
                                                handleUpdateSubject();
                                            } else {
                                                handleAddSubject();
                                            }
                                        }
                                    }}
                                    placeholder="Enter subject name"
                                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {editingSubject ? (
                                    <>
                                        <button
                                            onClick={handleUpdateSubject}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Update Subject
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingSubject(null);
                                                setNewSubjectName('');
                                            }}
                                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleAddSubject}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add Subject
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">Existing Subjects</h3>
                            </div>
                            {subjects.length === 0 ? (
                                <p className="text-gray-500">No subjects added yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {subjects.map((subject, index) => (
                                        <li key={subject.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                            <span className="text-gray-800">{subject.name}</span>
                                            <div className="space-x-2 flex items-center">
                                                <button
                                                    onClick={() => moveItemInList(subjects, setSubjects, subject.id, 'up')}
                                                    disabled={index === 0}
                                                    className={`p-1 rounded-full ${index === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                    title="Move Up"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => moveItemInList(subjects, setSubjects, subject.id, 'down')}
                                                    disabled={index === subjects.length - 1}
                                                    className={`p-1 rounded-full ${index === subjects.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                    title="Move Down"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEditSubject(subject)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubject(subject.id, subject.name)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );

            case 'chapters':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Chapters</h2>

                        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
                            </h3>
                            <div className="space-y-3">
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                                <div className="flex items-center space-x-3"> {/* Added for Change 02 */}
                                    <input
                                        type="text"
                                        value={newChapterName}
                                        onChange={(e) => setNewChapterName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (editingChapter) {
                                                    handleUpdateChapter();
                                                } else {
                                                    handleAddChapter();
                                                }
                                            }
                                        }}
                                        placeholder="Enter chapter name"
                                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {editingChapter ? (
                                        <>
                                            <button
                                                onClick={handleUpdateChapter}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Update Chapter
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingChapter(null);
                                                    setNewChapterName('');
                                                    setSelectedSubjectId('');
                                                }}
                                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleAddChapter}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Add Chapter
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">Existing Chapters</h3>
                            </div>
                            <select
                                value={filterSubjectId}
                                onChange={(e) => setFilterSubjectId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Filter by Subject (All)</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                                ))}
                            </select>

                            {filteredChapters.length === 0 ? (
                                <p className="text-gray-500">No chapters added yet or no chapters for selected subject.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredChapters.map((chapter, index) => {
                                        const subject = subjects.find(sub => sub.id === chapter.subjectId);
                                        return (
                                            <li key={chapter.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                                <span className="text-gray-800">
                                                    {chapter.name} <span className="text-gray-500 text-sm">({subject ? subject.name : 'Unknown Subject'})</span>
                                                </span>
                                                <div className="space-x-2 flex items-center">
                                                    <button
                                                        onClick={() => moveItemInList(chapters, setChapters, chapter.id, 'up')}
                                                        disabled={index === 0}
                                                        className={`p-1 rounded-full ${index === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                        title="Move Up"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => moveItemInList(chapters, setChapters, chapter.id, 'down')}
                                                        disabled={index === filteredChapters.length - 1} // Use filteredChapters length for correct bounds
                                                        className={`p-1 rounded-full ${index === filteredChapters.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                        title="Move Down"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditChapter(chapter)}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteChapter(chapter.id, chapter.name)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                );

            case 'topics':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Topics</h2>

                        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                            </h3>
                            <div className="space-y-3">
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => {
                                        setSelectedSubjectId(e.target.value);
                                        setSelectedChapterId(''); // Reset chapter when subject changes
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedChapterId}
                                    onChange={(e) => setSelectedChapterId(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!selectedSubjectId}
                                >
                                    <option value="">Select Chapter</option>
                                    {getChaptersForSelectedSubject(selectedSubjectId).map(chapter => (
                                        <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                    ))}
                                </select>
                                <div className="flex items-center space-x-3"> {/* Added for Change 02 */}
                                    <input
                                        type="text"
                                        value={newTopicName}
                                        onChange={(e) => setNewTopicName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                if (editingTopic) {
                                                    handleUpdateTopic();
                                                } else {
                                                    handleAddTopic();
                                                }
                                            }
                                        }}
                                        placeholder="Enter topic name"
                                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {editingTopic ? (
                                        <>
                                            <button
                                                onClick={handleUpdateTopic}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                            >
                                                Update Topic
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingTopic(null);
                                                    setNewTopicName('');
                                                    setSelectedSubjectId('');
                                                    setSelectedChapterId('');
                                                }}
                                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleAddTopic}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Add Topic
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">Existing Topics</h3>
                            </div>
                            <div className="flex space-x-2 mb-4">
                                <select
                                    value={filterTopicSubjectId}
                                    onChange={(e) => {
                                        setFilterTopicSubjectId(e.target.value);
                                        setFilterTopicChapterId(''); // Reset chapter filter when subject changes
                                    }}
                                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Filter by Subject (All)</option>
                                    {subjects.map(subject => (
                                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterTopicChapterId}
                                    onChange={(e) => setFilterTopicChapterId(e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!filterTopicSubjectId}
                                >
                                    <option value="">Filter by Chapter (All)</option>
                                    {getChaptersForSelectedSubject(filterTopicSubjectId).map(chapter => (
                                        <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                    ))}
                                </select>
                            </div>

                            {filteredTopics.length === 0 ? (
                                <p className="text-gray-500">No topics added yet or no topics for selected filters.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredTopics.map((topic, index) => {
                                        const subject = subjects.find(sub => sub.id === topic.subjectId);
                                        const chapter = chapters.find(chap => chap.id === topic.chapterId);
                                        return (
                                            <li key={topic.id} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                                <span className="text-gray-800">
                                                    {topic.name} <span className="text-gray-500 text-sm">({subject ? subject.name : 'Unknown Subject'} &gt; {chapter ? chapter.name : 'Unknown Chapter'})</span>
                                                </span>
                                                <div className="space-x-2 flex items-center">
                                                    <button
                                                        onClick={() => moveItemInList(topics, setTopics, topic.id, 'up')}
                                                        disabled={index === 0}
                                                        className={`p-1 rounded-full ${index === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                        title="Move Up"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => moveItemInList(topics, setTopics, topic.id, 'down')}
                                                        disabled={index === filteredTopics.length - 1} // Use filteredTopics length for correct bounds
                                                        className={`p-1 rounded-full ${index === filteredTopics.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-colors`}
                                                        title="Move Down"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditTopic(topic)}
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                );

            case 'questions':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Questions</h2>
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                onClick={() => setActiveQuestionSubTab('prelims')} // Changed for Change 03
                                className={`py-2 px-4 text-lg font-medium ${activeQuestionSubTab === 'prelims' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                Prelims {/* Changed for Change 03 */}
                            </button>
                            <button
                                onClick={() => setActiveQuestionSubTab('mains')} // Changed for Change 03
                                className={`py-2 px-4 text-lg font-medium ${activeQuestionSubTab === 'mains' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                Mains {/* Changed for Change 03 */}
                            </button>
                        </div>

                        {activeQuestionSubTab === 'prelims' && ( // Changed for Change 03
                            // Prelims Questions Content
                            <>
                                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                        {editingPrelimQuestion ? 'Edit Prelims Question' : 'Add New Prelims Question'} {/* Changed for Change 03 */}
                                    </h3>
                                    <div className="space-y-3">
                                        {/* Subject, Chapter, Topic Selects */}
                                        <select
                                            value={selectedPrelimSubjectId}
                                            onChange={(e) => {
                                                setSelectedPrelimSubjectId(e.target.value);
                                                setSelectedPrelimChapterId('');
                                                setSelectedPrelimTopicId('');
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedPrelimChapterId}
                                            onChange={(e) => {
                                                setSelectedPrelimChapterId(e.target.value);
                                                setSelectedPrelimTopicId('');
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedPrelimSubjectId}
                                        >
                                            <option value="">Select Chapter</option>
                                            {getChaptersForSelectedSubject(selectedPrelimSubjectId).map(chapter => (
                                                <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedPrelimTopicId}
                                            onChange={(e) => setSelectedPrelimTopicId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedPrelimChapterId}
                                        >
                                            <option value="">Select Topic (Optional)</option>
                                            {getTopicsForSelectedChapter(selectedPrelimChapterId).map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>

                                        <textarea
                                            value={newPrelimQuestionText}
                                            onChange={(e) => setNewPrelimQuestionText(e.target.value)}
                                            placeholder="Enter Prelims question text"
                                            rows="3"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                        {newPrelimQuestionOptions.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2"> {/* Added for Change 04 */}
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    onChange={(e) => handlePrelimOptionChange(index, 'text', e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                                    className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="number" // Added for Change 04
                                                    value={option.weightage}
                                                    onChange={(e) => handlePrelimOptionChange(index, 'weightage', e.target.value)}
                                                    placeholder="Weightage"
                                                    className="w-24 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        ))}
                                        <input
                                            type="text"
                                            value={newPrelimQuestionCorrectAnswer}
                                            onChange={(e) => setNewPrelimQuestionCorrectAnswer(e.target.value)}
                                            placeholder="Enter correct answer (e.g., 'Option A' or 'The exact answer')"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        {/* Difficulty Dropdown for Prelims */}
                                        <select
                                            value={newPrelimQuestionDifficulty}
                                            onChange={(e) => setNewPrelimQuestionDifficulty(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Difficult">Difficult</option>
                                        </select>

                                        <input
                                            type="number"
                                            value={newPrelimQuestionMarks}
                                            onChange={(e) => setNewPrelimQuestionMarks(Math.max(1, parseInt(e.target.value) || 1))}
                                            placeholder="Marks"
                                            min="1"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />

                                        {editingPrelimQuestion ? (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleUpdatePrelimQuestion}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-grow"
                                                >
                                                    Update Question
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingPrelimQuestion(null);
                                                        resetPrelimForm();
                                                    }}
                                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors flex-grow"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleAddPrelimQuestion}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Add Prelims Question {/* Changed for Change 03 */}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Prelims Questions</h3> {/* Changed for Change 03 */}
                                    {prelimQuestions.length === 0 ? (
                                        <p className="text-gray-500">No Prelims questions added yet.</p> {/* Changed for Change 03 */}
                                    ) : (
                                        <ul className="space-y-3">
                                            {prelimQuestions.map((q) => {
                                                const subject = subjects.find(sub => sub.id === q.subjectId);
                                                const chapter = chapters.find(chap => chap.id === q.chapterId);
                                                const topic = topics.find(t => t.id === q.topicId);
                                                return (
                                                    <li key={q.id} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                                        <p className="font-semibold text-gray-800">{q.questionText}</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-700 mb-2">
                                                            {q.options.map((opt, idx) => (
                                                                <li key={idx}>
                                                                    {String.fromCharCode(65 + idx)}. {opt.text} {/* Always access .text */}
                                                                    {opt.weightage !== undefined && ( // Simplified condition
                                                                        <span className="text-xs text-gray-500 ml-1">(Weightage: {opt.weightage})</span>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <p className="text-sm text-gray-600">
                                                            **Correct Answer:** {q.correctAnswer} <br />
                                                            **Difficulty:** {q.questionDifficulty} | **Marks:** {q.questionMarks} <br />
                                                            <span className="text-gray-500 text-xs">
                                                                {subject?.name} &gt; {chapter?.name} {topic ? `> ${topic.name}` : ''}
                                                            </span>
                                                        </p>
                                                        <div className="flex space-x-2 mt-2">
                                                            <button
                                                                onClick={() => handleEditPrelimQuestion(q)}
                                                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(q.id, q.questionText, 'Prelims')} {/* Changed for Change 03 */}
                                                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}

                        {activeQuestionSubTab === 'mains' && ( // Changed for Change 03
                            // Mains Questions Content
                            <>
                                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                        {editingMainsQuestion ? 'Edit Mains Question' : 'Add New Mains Question'} {/* Changed for Change 03 */}
                                    </h3>
                                    <div className="space-y-3">
                                        {/* Subject, Chapter, Topic Selects */}
                                        <select
                                            value={selectedMainsSubjectId}
                                            onChange={(e) => {
                                                setSelectedMainsSubjectId(e.target.value);
                                                setSelectedMainsChapterId('');
                                                setSelectedMainsTopicId('');
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(subject => (
                                                <option key={subject.id} value={subject.id}>{subject.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedMainsChapterId}
                                            onChange={(e) => {
                                                setSelectedMainsChapterId(e.target.value);
                                                setSelectedMainsTopicId('');
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedMainsSubjectId}
                                        >
                                            <option value="">Select Chapter</option>
                                            {getChaptersForSelectedSubject(selectedMainsSubjectId).map(chapter => (
                                                <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={selectedMainsTopicId}
                                            onChange={(e) => setSelectedMainsTopicId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            disabled={!selectedMainsChapterId}
                                        >
                                            <option value="">Select Topic (Optional)</option>
                                            {getTopicsForSelectedChapter(selectedMainsChapterId).map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>

                                        <textarea
                                            value={newMainsQuestionText}
                                            onChange={(e) => setNewMainsQuestionText(e.target.value)}
                                            placeholder="Enter Mains question text"
                                            rows="3"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>

                                        {/* Difficulty Dropdown for Mains */}
                                        <select
                                            value={newMainsQuestionDifficulty}
                                            onChange={(e) => setNewMainsQuestionDifficulty(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Difficult">Difficult</option>
                                        </select>

                                        <input
                                            type="number"
                                            value={newMainsQuestionMarks}
                                            onChange={(e) => setNewMainsQuestionMarks(Math.max(1, parseInt(e.target.value) || 1))}
                                            placeholder="Marks"
                                            min="1"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />


                                        {editingMainsQuestion ? (
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleUpdateMainsQuestion}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-grow"
                                                >
                                                    Update Question
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingMainsQuestion(null);
                                                        resetMainsForm();
                                                    }}
                                                    className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors flex-grow"
                                                    >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleAddMainsQuestion}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Add Mains Question {/* Changed for Change 03 */}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Mains Questions</h3> {/* Changed for Change 03 */}
                                    {mainsQuestions.length === 0 ? (
                                        <p className="text-gray-500">No Mains questions added yet.</p> {/* Changed for Change 03 */}
                                    ) : (
                                        <ul className="space-y-3">
                                            {mainsQuestions.map((q) => {
                                                const subject = subjects.find(sub => sub.id === q.subjectId);
                                                const chapter = chapters.find(chap => chap.id === q.chapterId);
                                                const topic = topics.find(t => t.id === q.topicId);
                                                return (
                                                    <li key={q.id} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                                        <p className="font-semibold text-gray-800">{q.questionText}</p>
                                                        <p className="text-sm text-gray-600">
                                                            **Difficulty:** {q.questionDifficulty} | **Marks:** {q.questionMarks} <br />
                                                            <span className="text-gray-500 text-xs">
                                                                {subject?.name} &gt; {chapter?.name} {topic ? `> ${topic.name}` : ''}
                                                            </span>
                                                        </p>
                                                        <div className="flex space-x-2 mt-2">
                                                            <button
                                                                onClick={() => handleEditMainsQuestion(q)}
                                                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(q.id, q.questionText, 'Mains')} {/* Changed for Change 03 */}
                                                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'planners':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Planners</h2>

                        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                                {editingPlanner ? 'Edit Planner' : 'Create New Planner'}
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newPlannerName}
                                    onChange={(e) => setNewPlannerName(e.target.value)}
                                    placeholder="Enter planner name (e.g., 'Weekly Study Plan')"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                <textarea
                                    value={newPlannerDescription}
                                    onChange={(e) => setNewPlannerDescription(e.target.value)}
                                    placeholder="Enter planner description (optional)"
                                    rows="2"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>

                                <h4 className="font-medium text-gray-700 mt-4 mb-2">Select Chapters for this Planner:</h4>
                                {subjects.length === 0 ? (
                                    <p className="text-gray-500">No subjects to display chapters from.</p>
                                ) : (
                                    <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto bg-white">
                                        {subjects.map(subject => (
                                            <div key={subject.id} className="mb-3">
                                                <p className="font-semibold text-blue-700 mb-2">{subject.name}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                                                    {chapters.filter(chap => chap.subjectId === subject.id).length === 0 ? (
                                                        <p className="text-gray-500 text-sm">No chapters for this subject.</p>
                                                    ) : (
                                                        chapters.filter(chap => chap.subjectId === subject.id).map(chapter => (
                                                            <label key={chapter.id} className="flex items-center text-gray-800 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tempSelectedPlannerChapters.includes(chapter.id)}
                                                                    onChange={() => handleTempPlannerChapterCheckboxChange(chapter.id)}
                                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                {chapter.name}
                                                            </label>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {editingPlanner ? (
                                    <div className="flex space-x-3 mt-4">
                                        <button
                                            onClick={handleUpdatePlanner}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-grow"
                                        >
                                            Update Planner
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingPlanner(null);
                                                setNewPlannerName('');
                                                setNewPlannerDescription('');
                                                setTempSelectedPlannerChapters([]);
                                            }}
                                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors flex-grow"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddPlanner}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4"
                                    >
                                        Create Planner
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Planners</h3>
                            {planners.length === 0 ? (
                                <p className="text-gray-500">No planners created yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {planners.map(planner => (
                                        <li key={planner.id} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                            <p className="font-bold text-lg text-gray-800">{planner.name}</p>
                                            {planner.description && <p className="text-gray-600 text-sm italic mb-2">{planner.description}</p>}
                                            <p className="font-semibold text-gray-700 text-sm">Chapters Included:</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mb-2">
                                                {planner.chapters.map(chapter => (
                                                    <li key={chapter.chapterId}>{chapter.chapterName} ({chapter.subjectName})</li>
                                                ))}
                                            </ul>
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    onClick={() => handleEditPlanner(planner)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePlanner(planner.id, planner.name)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                );

            case 'quiz':
                return (
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create & Manage Quizzes</h2>

                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                onClick={() => setActiveQuizSubTab('prelimQuiz')}
                                className={`py-2 px-4 text-lg font-medium ${activeQuizSubTab === 'prelimQuiz' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                Prelim Quizzes
                            </button>
                            <button
                                onClick={() => setActiveQuizSubTab('mainsQuiz')}
                                className={`py-2 px-4 text-lg font-medium ${activeQuizSubTab === 'mainsQuiz' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                            >
                                Mains Quizzes
                            </button>
                        </div>

                        {activeQuizSubTab === 'prelimQuiz' && (
                            <>
                                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Create New Prelim Quiz</h3>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={newQuizName}
                                            onChange={(e) => setNewQuizName(e.target.value)}
                                            placeholder="Enter quiz name (e.g., 'Chapter 1 Prelims Test')" {/* Changed for Change 03 */}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <textarea
                                            value={newQuizDescription}
                                            onChange={(e) => setNewQuizDescription(e.target.value)}
                                            placeholder="Enter quiz description (optional)"
                                            rows="2"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>

                                        <h4 className="font-medium text-gray-700 mt-4">Select Questions for this Quiz:</h4>
                                        <div className="flex space-x-4">
                                            <div className="flex-1 border p-3 rounded-md bg-white max-h-80 overflow-y-auto">
                                                <h5 className="font-semibold mb-2 text-blue-700">Prelims Questions</h5> {/* Changed for Change 03 */}
                                                {prelimQuestions.length === 0 ? (
                                                    <p className="text-gray-500 text-sm">No Prelims questions available.</p> {/* Changed for Change 03 */}
                                                ) : (
                                                    <div className="space-y-1">
                                                        {prelimQuestions.map(q => (
                                                            <label key={q.id} className="flex items-center text-gray-800 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tempSelectedQuestionIds.includes(q.id)}
                                                                    onChange={() => handleTempQuestionCheckboxChange(q.id)}
                                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                {q.questionText.substring(0, 50)}... ({subjects.find(s => s.id === q.subjectId)?.name} &gt; {chapters.find(c => c.id === q.chapterId)?.name})
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleAddQuestionsToQuiz('Prelims')} {/* Changed for Change 03 */}
                                                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm w-full"
                                                >
                                                    Add Selected Prelims {/* Changed for Change 03 */}
                                                </button>
                                            </div>

                                            <div className="flex-1 border p-3 rounded-md bg-white max-h-80 overflow-y-auto">
                                                <h5 className="font-semibold mb-2 text-blue-700">Mains Questions</h5> {/* Changed for Change 03 */}
                                                {mainsQuestions.length === 0 ? (
                                                    <p className="text-gray-500 text-sm">No Mains questions available.</p> {/* Changed for Change 03 */}
                                                ) : (
                                                    <div className="space-y-1">
                                                        {mainsQuestions.map(q => (
                                                            <label key={q.id} className="flex items-center text-gray-800 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={tempSelectedQuestionIds.includes(q.id)}
                                                                    onChange={() => handleTempQuestionCheckboxChange(q.id)}
                                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                />
                                                                {q.questionText.substring(0, 50)}... ({subjects.find(s => s.id === q.subjectId)?.name} &gt; {chapters.find(c => c.id === q.chapterId)?.name})
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleAddQuestionsToQuiz('Mains')} {/* Changed for Change 03 */}
                                                    className="mt-3 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm w-full"
                                                >
                                                    Add Selected Mains {/* Changed for Change 03 */}
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="font-medium text-gray-700 mt-4 mb-2">Questions Accumulated for this Quiz ({quizAccumulatedQuestions.length})</h4>
                                        {quizAccumulatedQuestions.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No questions added to the current quiz yet.</p>
                                        ) : (
                                            <ul className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto bg-white space-y-1">
                                                {quizAccumulatedQuestions.map(q => (
                                                    <li key={q.id} className="text-gray-700 text-sm">
                                                        [{q.questionTypeCategory}] {q.questionText.substring(0, 70)}... (Marks: {q.questionMarks}, Difficulty: {q.questionDifficulty})
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <button
                                            onClick={handleCreateQuiz}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mt-4"
                                        >
                                            Create Quiz
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 border rounded-lg bg-gray-50">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Quizzes</h3>
                                    {quizzes.length === 0 ? (
                                        <p className="text-gray-500">No quizzes created yet.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {quizzes.map(quiz => (
                                                <li key={quiz.id} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                                                    <p className="font-bold text-lg text-gray-800">{quiz.name}</p>
                                                    {quiz.description && <p className="text-gray-600 text-sm italic mb-2">{quiz.description}</p>}
                                                    <p className="font-semibold text-gray-700 text-sm">Total Questions: {quiz.questionDetails.length}</p>
                                                    <p className="font-semibold text-gray-700 text-sm mb-2">Total Marks: {quiz.questionDetails.reduce((sum, q) => sum + q.questionMarks, 0)}</p>

                                                    <h4 className="font-medium text-gray-700 text-sm mt-2">Questions in this Quiz:</h4>
                                                    <ul className="list-disc list-inside text-xs text-gray-600 ml-4 max-h-24 overflow-y-auto border p-2 rounded bg-gray-50">
                                                        {quiz.questionDetails.map(q => (
                                                            <li key={q.id}>[{q.questionTypeCategory}] {q.questionText.substring(0, 50)}... ({q.subjectName} > {q.chapterName})</li>
                                                        ))}
                                                    </ul>
                                                    <div className="flex space-x-2 mt-2">
                                                        <button
                                                            onClick={() => alert('View Quiz functionality to be implemented')}
                                                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                                                        >
                                                            View Quiz
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuiz(quiz.id, quiz.name)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}
                        {activeQuizSubTab === 'mainsQuiz' && (
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h3 className="text-xl font-semibold text-gray-700">Mains Quizzes (To be implemented)</h3>
                                <p className="text-gray-600">This section is for future development of Mains-style quizzes.</p>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <nav className="bg-white p-4 rounded-lg shadow mb-6">
                <ul className="flex justify-around">
                    <li>
                        <button
                            onClick={() => setActiveTab('subjects')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'subjects' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Subjects
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('chapters')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'chapters' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Chapters
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'topics' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Topics
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('questions')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'questions' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Questions
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('planners')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'planners' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Planners
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`py-2 px-4 rounded-md text-lg font-medium ${activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
                        >
                            Quiz
                        </button>
                    </li>
                </ul>
            </nav>

            {renderContent()}

            {showConfirmModal && (
                <ConfirmationModal
                    message={confirmModalMessage}
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

export default App;