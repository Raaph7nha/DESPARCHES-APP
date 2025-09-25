import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, User, AdminMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from '../components/ui';
import { LoaderCircle } from '../components/Icons';
import { Link } from 'react-router-dom';

const ADMIN_MESSAGES_KEY = 'desparches_admin_messages';

export const ContactPage = () => {
    const { user, getAllUsers } = useAuth();
    
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [admins, setAdmins] = useState<User[]>([]);

    useEffect(() => {
        const fetchAdmins = async () => {
            const allUsers = await getAllUsers();
            const adminUsers = allUsers.filter(u => u.role === Role.ADMIN_PRIMARIO || u.role === Role.ADMIN_SECUNDARIO);
            setAdmins(adminUsers);
        };
        fetchAdmins();
    }, [getAllUsers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || message.trim() === '') return;

        setIsSubmitting(true);
        const newMessage: AdminMessage = {
            id: `msg_${Date.now()}`,
            userId: user.uid,
            userEmail: user.email,
            subject,
            message,
            timestamp: new Date().toISOString(),
        };

        // Simulate sending by saving to localStorage
        setTimeout(() => {
            const existingMessages = JSON.parse(localStorage.getItem(ADMIN_MESSAGES_KEY) || '[]');
            localStorage.setItem(ADMIN_MESSAGES_KEY, JSON.stringify([...existingMessages, newMessage]));
            
            setIsSubmitting(false);
            setSuccessMessage('¡Tu mensaje ha sido enviado! Gracias por tus comentarios.');
            setSubject('');
            setMessage('');
        }, 1000); // Simulate network delay
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h1 className="text-3xl font-bold mb-2">Conoce a los Administradores</h1>
                    <p className="text-muted-foreground mb-6">Nuestro equipo está aquí para ayudar.</p>
                    <div className="space-y-4">
                        {admins.map(admin => (
                            <Card key={admin.uid} className="overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-4">
                                     <img src={admin.photoURL || ''} alt={admin.displayName || ''} className="h-16 w-16 rounded-full object-cover"/>
                                     <div>
                                         <p className="font-bold text-lg">{admin.displayName}</p>
                                         <p className="text-sm text-primary font-semibold">{admin.role}</p>
                                     </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíanos un Mensaje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user ? (
                                successMessage ? (
                                    <div className="text-center p-8 bg-green-50 border border-green-200 rounded-md">
                                        <p className="text-lg font-semibold text-green-700">{successMessage}</p>
                                    </div>
                                ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="subject">Asunto</Label>
                                        <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Sugerencia, reporte de error, etc." />
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Mensaje</Label>
                                        <Input as="textarea" id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Escribe tu mensaje aquí..." required />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Enviar Mensaje'}
                                    </Button>
                                </form>
                                )
                            ) : (
                                <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                    <p className="text-muted-foreground">Debes iniciar sesión para poder enviar un mensaje a los administradores.</p>
                                    <Link to="/login">
                                        <Button className="mt-4">Iniciar Sesión</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};