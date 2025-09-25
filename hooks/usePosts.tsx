import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPost } from '../types';

const POSTS_KEY = 'desparches_posts';

interface PostsContextType {
    posts: UserPost[];
    addPost: (postData: Omit<UserPost, 'id' | 'timestamp'>) => Promise<void>;
    getPostsByUser: (userId: string) => UserPost[];
}

const PostsContext = createContext<PostsContextType>({
    posts: [],
    addPost: async () => {},
    getPostsByUser: () => [],
});

export const PostsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [posts, setPosts] = useState<UserPost[]>([]);

    useEffect(() => {
        try {
            const postsJson = localStorage.getItem(POSTS_KEY);
            if (postsJson) {
                setPosts(JSON.parse(postsJson));
            }
        } catch (error) {
            console.error("Failed to load posts from localStorage:", error);
        }
    }, []);

    const addPost = async (postData: Omit<UserPost, 'id' | 'timestamp'>) => {
        const newPost: UserPost = {
            id: `post_${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...postData
        };
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        localStorage.setItem(POSTS_KEY, JSON.stringify(updatedPosts));
    };

    const getPostsByUser = (userId: string) => {
        return posts
            .filter(post => post.userId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    return (
        <PostsContext.Provider value={{ posts, addPost, getPostsByUser }}>
            {children}
        </PostsContext.Provider>
    );
};

export const usePosts = () => useContext(PostsContext);