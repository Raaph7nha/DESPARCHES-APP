import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui';
import { LoaderCircle } from '../components/Icons';

export const AuthPage = () => {
    const { user, loading, login, register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('email');

    useEffect(() => {
        if (!loading && user) {
            navigate('/');
        }
    }, [user, loading, navigate]);
    
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setError('');
        setEmail('');
        setPassword('');
    }

    const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await register(email, password);
            navigate('/');
        } catch (err: any) {
             let message = 'Ocurrió un error al crear la cuenta.';
             if (err.message === 'Email already in use') {
                message = 'El correo electrónico ya está registrado. Intenta iniciar sesión.';
             }
             setError(message);
        } finally {
            setIsLoading(false);
        }
    };


    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center"><LoaderCircle className="animate-spin h-10 w-10"/></div>
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-sm">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Iniciar Sesión</TabsTrigger>
                    <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                    <Card>
                        <CardHeader>
                            <CardTitle>Iniciar Sesión</CardTitle>
                            <CardDescription>Ingresa a tu cuenta para descubrir eventos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-login">Email</Label>
                                    <Input id="email-login" type="email" placeholder="tu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-login">Contraseña</Label>
                                    <Input id="password-login" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Iniciar Sesión'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Cuenta</CardTitle>
                            <CardDescription>Únete a la comunidad de Desparches.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-signup">Email</Label>
                                    <Input id="email-signup" type="email" placeholder="tu@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-signup">Contraseña</Label>
                                    <Input id="password-signup" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Crear Cuenta'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};