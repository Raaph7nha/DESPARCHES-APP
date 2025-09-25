import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { useEvents } from '../hooks/useEvents';
import { usePosts } from '../hooks/usePosts';
import { Event, UserPost } from '../types';
import { Button, Card, CardContent, CardTitle, cn, Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, Input, Label } from '../components/ui';
import { Bookmark, LoaderCircle, Edit, Camera } from '../components/Icons';

const EventProfileCard = ({ event }: React.PropsWithChildren<{ event: Event }>) => {
    const { isEventSaved, toggleSaveEvent } = useSavedEvents();
    const saved = isEventSaved(event.id);
    
    return (
        <Card className="w-full">
            <div className="relative">
                <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded-t-lg" />
                 <Button 
                    size="icon" 
                    variant={saved ? 'default' : 'secondary'}
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => toggleSaveEvent(event.id)}
                >
                    <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                </Button>
            </div>
            <CardContent className="p-4">
                <CardTitle className="text-lg truncate">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p className="text-sm text-muted-foreground truncate">{event.location.address}</p>
            </CardContent>
        </Card>
    );
};


export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { savedEventIds } = useSavedEvents();
    const { events, loading: eventsLoading } = useEvents();
    const { posts, addPost, getPostsByUser } = usePosts();

    const [savedEvents, setSavedEvents] = useState<Event[]>([]);
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    
    // State for editing profile
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    
    // State for new post
    const [isPostSheetOpen, setIsPostSheetOpen] = useState(false);
    const [postImage, setPostImage] = useState<string | null>(null);
    const [postCaption, setPostCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!eventsLoading && user) {
            const userSavedEvents = events.filter(event => savedEventIds.includes(event.id));
            setSavedEvents(userSavedEvents);
            setUserPosts(getPostsByUser(user.uid));
        }
    }, [savedEventIds, events, eventsLoading, user, posts, getPostsByUser]);

    const favoriteCategories = useMemo(() => {
        if (savedEvents.length === 0) return [];
        const categoryCounts = savedEvents.reduce<Record<string, number>>((acc, event) => {
            acc[event.category] = (acc[event.category] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(categoryCounts)
            .sort(([, countA], [, countB]) => Number(countB) - Number(countA))
            .slice(0, 3)
            .map(([category]) => category.charAt(0).toUpperCase() + category.slice(1));
    }, [savedEvents]);

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = async () => {
                await updateUser({ ...user, photoURL: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if(user) {
            await updateUser({ ...user, displayName });
            setIsEditSheetOpen(false);
        }
    };
    
    const handlePostImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if(user && postImage) {
            setIsUploading(true);
            await addPost({
                userId: user.uid,
                imageUrl: postImage,
                caption: postCaption,
            });
            setPostImage(null);
            setPostCaption('');
            setIsUploading(false);
            setIsPostSheetOpen(false);
        }
    };


    if (!user) {
        return null; // Should be handled by ProtectedRoute
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row items-center gap-6 mb-12">
                <div className="relative group">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`}
                        alt="Foto de perfil"
                        className="h-24 w-24 rounded-full object-cover"
                    />
                    <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <Camera className="h-6 w-6" />
                       <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange}/>
                    </label>
                </div>

                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold">{user.displayName || 'Usuario'}</h1>
                         <Button variant="outline" size="icon" onClick={() => setIsEditSheetOpen(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-muted-foreground">{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold text-primary-foreground bg-primary rounded-full">{user.role}</span>
                </div>
            </header>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Tus Categorías Favoritas</h2>
                {favoriteCategories.length > 0 ? (
                    <div className="flex gap-4">
                        {favoriteCategories.map(category => (
                            <div key={category} className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">{category}</div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Guarda algunos eventos para ver tus categorías favoritas.</p>
                )}
            </section>
            
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Mis Publicaciones</h2>
                    <Button onClick={() => setIsPostSheetOpen(true)}>
                        <Camera className="mr-2 h-4 w-4" />
                        Crear Publicación
                    </Button>
                </div>
                {userPosts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {userPosts.map(post => (
                            <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                                <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm">{post.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-10">No has publicado ninguna foto todavía.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Eventos Guardados</h2>
                {eventsLoading ? (
                    <div className="flex justify-center"><LoaderCircle className="h-8 w-8 animate-spin" /></div>
                ) : savedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedEvents.map(event => (
                            <EventProfileCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-10">Aún no has guardado ningún evento. ¡Empieza a explorar!</p>
                )}
            </section>

            {/* Edit Profile Sheet */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Editar Perfil</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="displayName">Nombre de Usuario</Label>
                            <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                        </div>
                        <Button type="submit">Guardar Cambios</Button>
                    </form>
                </SheetContent>
            </Sheet>
            
            {/* New Post Sheet */}
            <Sheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Crear Nueva Publicación</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleCreatePost} className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="postImage">Imagen</Label>
                            <Input id="postImage" type="file" accept="image/*" onChange={handlePostImageSelect} required className="h-auto p-0 border-0 file:h-10 file:px-3 file:py-2"/>
                            {postImage && <img src={postImage} alt="Preview" className="mt-4 rounded-md max-h-60 w-full object-contain" />}
                        </div>
                         <div>
                            <Label htmlFor="postCaption">Descripción</Label>
                            <Input as="textarea" id="postCaption" value={postCaption} onChange={e => setPostCaption(e.target.value)} placeholder="Añade una descripción..."/>
                        </div>
                        <Button type="submit" className="w-full" disabled={isUploading || !postImage}>
                            {isUploading ? <LoaderCircle className="animate-spin h-5 w-5"/> : 'Publicar'}
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
};