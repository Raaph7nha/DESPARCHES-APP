import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { SavedEventsProvider } from './hooks/useSavedEvents';
import { EventsProvider } from './hooks/useEvents';
import { PostsProvider } from './hooks/usePosts';
import { ReviewsProvider } from './hooks/useReviews';
import { ForumProvider } from './hooks/useForum';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ChatPage } from './pages/ChatPage';
import { ForumPage } from './pages/ForumPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Button } from './components/ui';
import { PartyPopper, LogOut, UserCog, Search, MessageCircle, MessageSquare } from './components/Icons';
import { Role } from './types';
import { Footer } from './components/Footer';

const AppHeader = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/events');
        }
    }

    return (
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <PartyPopper className="h-6 w-6 text-primary" />
                    Desparches
                </Link>
                <div className="flex-1 flex justify-center px-8">
                     <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Buscar eventos, artistas o lugares..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </form>
                </div>
                <nav className="flex items-center gap-2">
                    <Link to="/chat">
                        <Button variant="ghost" className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Chat
                        </Button>
                    </Link>
                    <Link to="/forum">
                        <Button variant="ghost" className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Foro
                        </Button>
                    </Link>
                    <Link to="/profile">
                        <Button variant="ghost" className="flex items-center gap-2">
                            <UserCog className="h-5 w-5" />
                            Perfil
                        </Button>
                    </Link>

                    {user ? (
                        <>
                            {isAdmin && <Link to="/admin"><Button variant="ghost">Admin</Button></Link>}
                            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                                <LogOut className="h-5 w-5" />
                                Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><Button variant="ghost">Iniciar Sesión</Button></Link>
                            <Link to="/login"><Button>Registrarse</Button></Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const AppLayout = ({ children }: React.PropsWithChildren<{}>) => (
    <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);


function App() {
  return (
    <AuthProvider>
        <SavedEventsProvider>
            <EventsProvider>
                <PostsProvider>
                    <ReviewsProvider>
                        <ForumProvider>
                            <HashRouter>
                                <AppLayout>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/login" element={<AuthPage />} />
                                        <Route path="/events" element={<EventsPage />} />
                                        <Route path="/reviews" element={<ReviewsPage />} />
                                        <Route path="/contact" element={<ContactPage />} />
                                        <Route 
                                            path="/chat" 
                                            element={
                                                <ProtectedRoute>
                                                    <ChatPage />
                                                </ProtectedRoute>
                                            } 
                                        />
                                        <Route 
                                            path="/forum" 
                                            element={
                                                <ProtectedRoute>
                                                    <ForumPage />
                                                </ProtectedRoute>
                                            } 
                                        />
                                         <Route 
                                            path="/forum/:threadId" 
                                            element={
                                                <ProtectedRoute>
                                                    <ForumPage />
                                                </ProtectedRoute>
                                            } 
                                        />
                                        <Route 
                                            path="/profile" 
                                            element={
                                                <ProtectedRoute>
                                                    <ProfilePage />
                                                </ProtectedRoute>
                                            } 
                                        />
                                        <Route 
                                            path="/admin" 
                                            element={
                                                <ProtectedRoute allowedRoles={[Role.ADMIN_SECUNDARIO, Role.ADMIN_PRIMARIO]}>
                                                    <AdminPage />
                                                </ProtectedRoute>
                                            } 
                                        />
                                    </Routes>
                                </AppLayout>
                            </HashRouter>
                        </ForumProvider>
                    </ReviewsProvider>
                </PostsProvider>
            </EventsProvider>
        </SavedEventsProvider>
    </AuthProvider>
  );
}

export default App;