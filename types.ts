import React from 'react';

export enum Role {
    USUARIO = 'Usuario',
    DISENADOR = 'Diseñador',
    AYUDANTE = 'Ayudante',
    ADMIN_SECUNDARIO = 'Admin Secundario',
    ADMIN_PRIMARIO = 'Admin Primario'
}

export const roleHierarchy: { [key in Role]: number } = {
    [Role.USUARIO]: 0,
    [Role.DISENADOR]: 1,
    [Role.AYUDANTE]: 2,
    [Role.ADMIN_SECUNDARIO]: 3,
    [Role.ADMIN_PRIMARIO]: 4
};

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: Role;
    favoriteCategories?: string[];
    password?: string; // Only for mock data
}

export interface UserPost {
    id: string;
    userId: string;
    imageUrl: string; // base64 string
    caption: string;
    timestamp: string; // ISO 8601 string
}

export interface EventCategory {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // ISO 8601 string
    imageUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    category: string; 
    organizer: string;
    website: string;
}

export interface Review {
    id: string;
    userId: string;
    rating: number; // 1-5
    comment: string;
    timestamp: string; // ISO 8601 string
}

export interface AdminMessage {
    id: string;
    userId: string;
    userEmail: string | null;
    subject: string;
    message: string;
    timestamp: string;
}

export interface ForumThread {
    id: string;
    title: string;
    content: string;
    authorId: string;
    authorName: string | null;
    authorPhotoURL: string | null;
    timestamp: string; // ISO 8601 string
    commentCount: number;
    lastCommentTimestamp: string | null; // ISO 8601 string
}

export interface ForumComment {
    id: string;
    threadId: string;
    content: string;
    authorId: string;
    authorName: string | null;
    authorPhotoURL: string | null;
    timestamp: string; // ISO 8601 string
}