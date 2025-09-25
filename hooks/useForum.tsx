import React, { createContext, useContext, useState, useEffect } from 'react';
import { ForumThread, ForumComment } from '../types';
import { useAuth } from './useAuth';

const THREADS_KEY = 'desparches_forum_threads';
const COMMENTS_KEY = 'desparches_forum_comments';

interface ForumContextType {
    threads: ForumThread[];
    loadingThreads: boolean;
    addThread: (title: string, content: string) => Promise<void>;
    getThread: (threadId: string) => ForumThread | undefined;
    getComments: (threadId: string) => ForumComment[];
    addComment: (threadId: string, content: string) => Promise<void>;
}

const ForumContext = createContext<ForumContextType>({
    threads: [],
    loadingThreads: true,
    addThread: async () => {},
    getThread: () => undefined,
    getComments: () => [],
    addComment: async () => {},
});

export const ForumProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const { user } = useAuth();
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);

    useEffect(() => {
        try {
            const threadsJson = localStorage.getItem(THREADS_KEY);
            const commentsJson = localStorage.getItem(COMMENTS_KEY);
            if (threadsJson) {
                setThreads(JSON.parse(threadsJson));
            }
            if (commentsJson) {
                setComments(JSON.parse(commentsJson));
            }
        } catch (e) {
            console.error("Failed to load forum data from localStorage", e);
        } finally {
            setLoadingThreads(false);
        }
    }, []);

    const getThread = (threadId: string) => {
        return threads.find(t => t.id === threadId);
    };
    
    const getComments = (threadId: string) => {
        return comments
            .filter(c => c.threadId === threadId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    };

    const addThread = async (title: string, content: string) => {
        if (!user) throw new Error("User must be logged in to create a thread.");
        
        const timestamp = new Date().toISOString();
        
        const newThread: ForumThread = {
            id: `thread_${Date.now()}`,
            title,
            content,
            authorId: user.uid,
            authorName: user.displayName,
            authorPhotoURL: user.photoURL,
            timestamp,
            lastCommentTimestamp: timestamp,
            commentCount: 0,
        };

        const updatedThreads = [...threads, newThread].sort((a, b) => new Date(b.lastCommentTimestamp!).getTime() - new Date(a.lastCommentTimestamp!).getTime());
        setThreads(updatedThreads);
        localStorage.setItem(THREADS_KEY, JSON.stringify(updatedThreads));
    };

    const addComment = async (threadId: string, content: string) => {
        if (!user) throw new Error("User must be logged in to comment.");
        
        const timestamp = new Date().toISOString();

        const newComment: ForumComment = {
            id: `comment_${Date.now()}`,
            content,
            threadId,
            authorId: user.uid,
            authorName: user.displayName,
            authorPhotoURL: user.photoURL,
            timestamp,
        };
        
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
        
        const updatedThreads = threads.map(t => {
            if (t.id === threadId) {
                return { ...t, commentCount: t.commentCount + 1, lastCommentTimestamp: timestamp };
            }
            return t;
        }).sort((a, b) => new Date(b.lastCommentTimestamp!).getTime() - new Date(a.lastCommentTimestamp!).getTime());

        setThreads(updatedThreads);
        localStorage.setItem(THREADS_KEY, JSON.stringify(updatedThreads));
    };

    const value = { threads, loadingThreads, addThread, getThread, getComments, addComment };

    return (
        <ForumContext.Provider value={value}>
            {children}
        </ForumContext.Provider>
    );
};

export const useForum = () => useContext(ForumContext);