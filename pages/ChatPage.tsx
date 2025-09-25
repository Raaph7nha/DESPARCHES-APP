import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, cn } from '../components/ui';
import { Send, LoaderCircle, MessageCircle } from '../components/Icons';

const CHAT_KEY = 'desparches_chat';

interface Message {
    id: string;
    text: string;
    timestamp: string; // ISO 8601 string
    user: {
        uid: string;
        displayName: string | null;
        photoURL: string | null;
    };
}

const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        try {
            const messagesJson = localStorage.getItem(CHAT_KEY);
            if (messagesJson) {
                const loadedMessages = JSON.parse(messagesJson);
                setMessages(loadedMessages);
            }
        } catch (e) {
            console.error("Failed to load chat messages from localStorage", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        const messageData: Message = {
            id: `msg_${Date.now()}`,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
            user: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
        };

        const updatedMessages = [...messages, messageData];
        setMessages(updatedMessages);
        localStorage.setItem(CHAT_KEY, JSON.stringify(updatedMessages));
        setNewMessage('');
    };

    if (loading || !user) {
        return <div className="flex h-full items-center justify-center"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="container mx-auto h-[calc(100vh-4rem-1px)] flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4 border-b pb-2">Chat Global</h1>
            <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const isCurrentUser = msg.user.uid === user.uid;
                        const prevMessage = messages[index-1];
                        const showUserDetails = !prevMessage || prevMessage.user.uid !== msg.user.uid;

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    'flex items-start gap-3',
                                    isCurrentUser ? 'justify-end' : 'justify-start',
                                    !showUserDetails && (isCurrentUser ? 'ml-11' : 'ml-11')
                                )}
                            >
                                {!isCurrentUser && (
                                    <img
                                        src={showUserDetails ? (msg.user.photoURL || `https://ui-avatars.com/api/?name=${msg.user.displayName}`) : undefined}
                                        alt={msg.user.displayName || 'Avatar'}
                                        className="h-8 w-8 rounded-full mt-1"
                                        style={{ visibility: showUserDetails ? 'visible' : 'hidden' }}
                                    />
                                )}
                                <div className={cn(
                                    'max-w-xs md:max-w-md p-3 rounded-lg',
                                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                )}>
                                    {showUserDetails && !isCurrentUser && (
                                        <p className="font-bold text-sm mb-1">{msg.user.displayName}</p>
                                    )}
                                    <p className="text-base break-words">{msg.text}</p>
                                    <p className={cn(
                                        'text-xs mt-1',
                                        isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground',
                                        'text-right'
                                    )}>{formatTime(msg.timestamp)}</p>
                                </div>
                                 {isCurrentUser && (
                                    <img
                                        src={showUserDetails ? (msg.user.photoURL || `https://ui-avatars.com/api/?name=${msg.user.displayName}`) : undefined}
                                        alt={msg.user.displayName || 'Avatar'}
                                        className="h-8 w-8 rounded-full mt-1"
                                         style={{ visibility: showUserDetails ? 'visible' : 'hidden' }}
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <MessageCircle className="h-16 w-16 mb-4" />
                            <h2 className="text-xl font-semibold">¡Bienvenido al Chat Global!</h2>
                            <p>Aún no hay mensajes. ¡Sé el primero en saludar!</p>
                        </div>
                    )
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 border-t pt-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};