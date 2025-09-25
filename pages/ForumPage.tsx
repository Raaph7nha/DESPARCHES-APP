import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForum } from '../hooks/useForum';
import { ForumThread, ForumComment } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Label, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, cn } from '../components/ui';
import { LoaderCircle, MessageSquare, Send, ChevronLeft } from '../components/Icons';

const timeAgo = (isoString: string | null): string => {
    if (!isoString) return 'hace un momento';
    const date = new Date(isoString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return 'hace un momento';
};

const ThreadList = () => {
    const { threads, loadingThreads, addThread } = useForum();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() === '' || content.trim() === '') return;
        setIsSubmitting(true);
        try {
            await addThread(title, content);
            setTitle('');
            setContent('');
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to create thread:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Foro de la Comunidad</h1>
                <Button onClick={() => setIsSheetOpen(true)}>Crear Hilo</Button>
            </div>

            {loadingThreads ? (
                <div className="flex justify-center mt-16">
                    <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : threads.length === 0 ? (
                <div className="text-center py-16 bg-muted rounded-lg">
                    <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">No hay hilos todavía.</h3>
                    <p className="text-muted-foreground">¡Sé el primero en iniciar una conversación!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {threads.map(thread => (
                        <Link to={`/forum/${thread.id}`} key={thread.id}>
                            <Card className="hover:bg-accent transition-colors">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <img src={thread.authorPhotoURL || `https://ui-avatars.com/api/?name=${thread.authorName}&background=random`} alt={thread.authorName || 'Avatar'} className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{thread.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Creado por {thread.authorName} &bull; {timeAgo(thread.timestamp)}
                                        </p>
                                    </div>
                                    <div className="text-center flex-shrink-0 ml-4">
                                        <p className="font-bold text-lg">{thread.commentCount}</p>
                                        <p className="text-sm text-muted-foreground">Respuestas</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Iniciar un Nuevo Hilo</SheetTitle>
                        <SheetDescription>Comparte tus ideas o preguntas con la comunidad.</SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleCreateThread} className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Un título descriptivo" required />
                        </div>
                        <div>
                            <Label htmlFor="content">Contenido</Label>
                            <Input as="textarea" id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Escribe tu mensaje aquí..." required className="h-32" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Publicar Hilo'}
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
};

const ThreadDetail = ({ threadId }: { threadId: string }) => {
    const { getThread, getComments, addComment } = useForum();
    const navigate = useNavigate();

    const [thread, setThread] = useState<ForumThread | undefined | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        const currentThread = getThread(threadId);
        if (currentThread) {
            setThread(currentThread);
            setComments(getComments(threadId));
        } else {
            // This might happen if threads are not loaded yet.
            // A more robust solution might wait for loading to finish.
            // For now, redirect if not found immediately.
            setThread(null);
        }
        setLoading(false);
    }, [threadId, getThread, getComments]);
    
    useEffect(() => {
        // When a new comment is added via the context, the comments state will update.
        if(thread) {
            setComments(getComments(thread.id));
        }
    }, [getComments, thread]);

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        setIsSubmitting(true);
        try {
            await addComment(threadId, newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><LoaderCircle className="h-12 w-12 animate-spin" /></div>;
    }

    if (!thread) {
         return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Hilo no encontrado</h1>
                <Button onClick={() => navigate('/forum')} className="mt-4">
                    Volver al Foro
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem-1px)] flex flex-col">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/forum')} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" /> Volver al Foro
                </Button>
                <h1 className="text-3xl font-bold">{thread.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <img src={thread.authorPhotoURL || ''} alt={thread.authorName || ''} className="h-6 w-6 rounded-full" />
                    <span>Publicado por <strong>{thread.authorName}</strong> &bull; {timeAgo(thread.timestamp)}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                <Card className="bg-muted">
                    <CardContent className="p-6 whitespace-pre-wrap">{thread.content}</CardContent>
                </Card>

                {comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-4">
                        <img src={comment.authorPhotoURL || ''} alt={comment.authorName || ''} className="h-10 w-10 rounded-full mt-1" />
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold">{comment.authorName}</span>
                                <span className="text-xs text-muted-foreground">{timeAgo(comment.timestamp)}</span>
                            </div>
                            <Card className="mt-1">
                                <CardContent className="p-3">{comment.content}</CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
                <div ref={commentsEndRef} />
            </div>

            <div className="mt-4 border-t pt-4">
                <form onSubmit={handleAddComment} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={isSubmitting || !newComment.trim()}>
                        {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export const ForumPage = () => {
    const { threadId } = useParams<{ threadId: string }>();
    return threadId ? <ThreadDetail threadId={threadId} /> : <ThreadList />;
};