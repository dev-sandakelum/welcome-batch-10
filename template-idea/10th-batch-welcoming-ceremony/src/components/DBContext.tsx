import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Question, Score, Feedback, UserQuestion,
  INITIAL_QUESTIONS, INITIAL_SCORES, INITIAL_FEEDBACK, INITIAL_USER_QUESTIONS 
} from '../types';

interface DBContextType {
  questions: Question[];
  scores: Score[];
  feedbacks: Feedback[];
  userQuestions: UserQuestion[];
  visitorCount: number;
  addQuestion: (q: Omit<Question, 'id'>) => void;
  updateQuestion: (id: string, q: Question) => void;
  deleteQuestion: (id: string) => void;
  addScore: (s: Omit<Score, 'id' | 'submittedAt'>) => void;
  deleteScore: (id: string) => void;
  addFeedback: (f: Omit<Feedback, 'id' | 'submittedAt'>) => void;
  deleteFeedback: (id: string) => void;
  addUserQuestion: (uq: Omit<UserQuestion, 'id' | 'askedAt' | 'isAnswered'>) => void;
  answerUserQuestion: (id: string, answerText: string) => void;
  deleteUserQuestion: (id: string) => void;
  resetDatabase: () => void;
}

const DBContext = createContext<DBContextType | undefined>(undefined);

export const DBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('peacock_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [scores, setScores] = useState<Score[]>(() => {
    const saved = localStorage.getItem('peacock_scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => {
    const saved = localStorage.getItem('peacock_feedbacks');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>(() => {
    const saved = localStorage.getItem('peacock_user_questions');
    return saved ? JSON.parse(saved) : INITIAL_USER_QUESTIONS;
  });

  const [visitorCount, setVisitorCount] = useState<number>(312);

  // Sync state to local storage when state changes
  useEffect(() => {
    localStorage.setItem('peacock_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('peacock_scores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('peacock_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('peacock_user_questions', JSON.stringify(userQuestions));
  }, [userQuestions]);

  // Simulate live visitor counter updating every 10 seconds (as requested in Public Routes)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => {
        const delta = Math.floor(Math.random() * 5) - 1; // randomly add or subtract up to 3 visitors
        const nextValue = Math.max(280, prev + delta);
        return nextValue;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Question
  const addQuestion = (q: Omit<Question, 'id'>) => {
    const newQ: Question = {
      ...q,
      id: 'q_' + Date.now()
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const updateQuestion = (id: string, updatedQ: Question) => {
    setQuestions(prev => prev.map(q => q.id === id ? updatedQ : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // CRUD Score
  const addScore = (s: Omit<Score, 'id' | 'submittedAt'>) => {
    const newS: Score = {
      ...s,
      id: 's_' + Date.now(),
      submittedAt: new Date().toISOString()
    };
    setScores(prev => [newS, ...prev]);
  };

  const deleteScore = (id: string) => {
    setScores(prev => prev.filter(s => s.id !== id));
  };

  // CRUD Feedback
  const addFeedback = (f: Omit<Feedback, 'id' | 'submittedAt'>) => {
    const newF: Feedback = {
      ...f,
      id: 'f_' + Date.now(),
      submittedAt: new Date().toISOString()
    };
    setFeedbacks(prev => [newF, ...prev]);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  // CRUD User Question
  const addUserQuestion = (uq: Omit<UserQuestion, 'id' | 'askedAt' | 'isAnswered'>) => {
    const newUQ: UserQuestion = {
      ...uq,
      id: 'uq_' + Date.now(),
      isAnswered: false,
      askedAt: new Date().toISOString()
    };
    setUserQuestions(prev => [newUQ, ...prev]);
  };

  const answerUserQuestion = (id: string, answerText: string) => {
    setUserQuestions(prev => prev.map(uq => {
      if (uq.id === id) {
        return {
          ...uq,
          answerText,
          isAnswered: true,
          answeredAt: new Date().toISOString()
        };
      }
      return uq;
    }));
  };

  const deleteUserQuestion = (id: string) => {
    setUserQuestions(prev => prev.filter(uq => uq.id !== id));
  };

  const resetDatabase = () => {
    setQuestions(INITIAL_QUESTIONS);
    setScores(INITIAL_SCORES);
    setFeedbacks(INITIAL_FEEDBACK);
    setUserQuestions(INITIAL_USER_QUESTIONS);
  };

  return (
    <DBContext.Provider value={{
      questions,
      scores,
      feedbacks,
      userQuestions,
      visitorCount,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      addScore,
      deleteScore,
      addFeedback,
      deleteFeedback,
      addUserQuestion,
      answerUserQuestion,
      deleteUserQuestion,
      resetDatabase
    }}>
      {children}
    </DBContext.Provider>
  );
};

export const useDB = () => {
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be used within a DBProvider');
  }
  return context;
};
