import React, { useState, useMemo, useEffect } from 'react';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, cn } from '../components/ui';
import { Star, LoaderCircle } from '../components/Icons';
import { Link } from 'react-router-dom';
import { User } from '../types';

const StarRating = ({ rating, setRating, disabled = false }: { rating: number, setRating: (r: number) => void, disabled?: boolean }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    onClick={() => setRating(star)}
                    className={cn("disabled:cursor-not-allowed", !disabled && "cursor-pointer")}
                    aria-label={`Calificar con ${star} estrellas`}
                >
                    <Star
                        className={cn(
                            "h-8 w-8 transition-colors",
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

export const ReviewsPage = () => {
    const { user, getAllUsers } = useAuth();
    const { reviews, addReview, getUserReview } = useReviews();
    
    const userReview = user ? getUserReview(user.uid) : undefined;

    const [rating, setRating] = useState(userReview?.rating || 0);
    const [comment, setComment] = useState(userReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            setAllUsers(users);
        };
        fetchUsers();
    }, [getAllUsers]);


    const reviewsWithUserData = useMemo(() => {
        return reviews
            .map(review => {
                const reviewUser = allUsers.find(u => u.uid === review.userId);
                return reviewUser ? { ...review, user: reviewUser } : null;
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime());
    }, [reviews, allUsers]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || rating === 0 || comment.trim() === '') {
            setMessage('Por favor, selecciona una calificación y escribe un comentario.');
            return;
        }
        setIsSubmitting(true);
        setMessage('');
        await addReview({ rating, comment }, user.uid);
        setIsSubmitting(false);
        setMessage('¡Gracias por tu reseña!');
    };
    
    React.useEffect(() => {
        if(userReview) {
            setRating(userReview.rating);
            setComment(userReview.comment);
        }
    }, [userReview]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Reseñas de la Comunidad</h1>

            <Card className="mb-12">
                <CardHeader>
                    <CardTitle>{userReview ? 'Edita tu reseña' : 'Deja tu reseña'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Calificación</Label>
                                <StarRating rating={rating} setRating={setRating} />
                            </div>
                            <div>
                                <Label htmlFor="comment">Comentario</Label>
                                <Input as="textarea" id="comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="¿Qué te parece la app?" required />
                            </div>
                             {message && <p className="text-sm text-green-600">{message}</p>}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <LoaderCircle className="animate-spin h-5 w-5" /> : (userReview ? 'Actualizar Reseña' : 'Publicar Reseña')}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center p-8 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Debes iniciar sesión para poder dejar una reseña.</p>
                            <Link to="/login">
                                <Button className="mt-4">Iniciar Sesión</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Comentarios Recientes</h2>
                {reviewsWithUserData.length > 0 ? (
                    reviewsWithUserData.map(review => (
                        <Card key={review!.id}>
                            <CardContent className="p-4 flex gap-4">
                                <img src={review!.user.photoURL || ''} alt={review!.user.displayName || ''} className="h-12 w-12 rounded-full mt-1" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{review!.user.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(review!.timestamp).toLocaleDateString('es-ES')}</p>
                                        </div>
                                        <div className="flex">
                                           {[...Array(5)].map((_, i) => (
                                               <Star key={i} className={cn("h-5 w-5", i < review!.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/50')} />
                                           ))}
                                        </div>
                                    </div>
                                    <p className="mt-2">{review!.comment}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-8">Aún no hay reseñas. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    );
};