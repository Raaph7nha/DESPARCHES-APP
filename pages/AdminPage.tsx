import React, { useState, useEffect, useCallback } from 'react';
import { User, Event, Role, roleHierarchy, EventCategory } from '../types';
import { Button, Input, Label, Tabs, TabsContent, TabsList, TabsTrigger, Card, CardHeader, CardTitle, CardContent, cn } from '../components/ui';
import { LoaderCircle, CalendarPlus, UserCog, Trash2 } from '../components/Icons';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { EventMap } from '../components/EventMap';

// --- Event Management Tab ---
const EventManagement = () => {
    const { addEvent } = useEvents();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [category, setCategory] = useState('musica');
    const [organizer, setOrganizer] = useState('');
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleMapClick = (loc: { lat: number; lng: number }) => {
        setLocation(loc);
        setAddress(`Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`); // Placeholder, ideally use Geocoding API
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) {
            setMessage({ type: 'error', text: 'Por favor, selecciona una ubicación en el mapa.' });
            return;
        }
        setIsSubmitting(true);
        setMessage(null);

        try {
            const eventDateTime = new Date(`${date}T${time}`);
            const newEvent: Omit<Event, 'id'> = {
                title,
                description,
                date: eventDateTime.toISOString(),
                category,
                organizer,
                website,
                location: { ...location, address },
                imageUrl: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/300`,
            };
            await addEvent(newEvent);
            setMessage({ type: 'success', text: '¡Evento creado exitosamente!' });
            // Reset form
            setTitle(''); setDescription(''); setDate(''); setTime(''); setCategory('musica'); setOrganizer(''); setWebsite(''); setLocation(null); setAddress(''); setImageUrl('');
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Ocurrió un error al crear el evento.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const dummyEventForMap = location ? [{ id: 'new', location, title: 'Nueva Ubicación', category: 'temp', date: new Date().toISOString(), description: '', imageUrl:'', organizer:'', website:'' } as Event] : [];
    const categoriesForMap: EventCategory[] = [{ id: 'temp', name: 'temp', color: '#ef4444', icon: () => null }];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear Nuevo Evento</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Título del Evento</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Input as="textarea" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="date">Fecha</Label>
                                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="time">Hora</Label>
                                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="category">Categoría</Label>
                            <Input as="select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="musica">Música</option>
                                <option value="gastronomia">Gastronomía</option>
                                <option value="cine">Cine</option>
                                <option value="arte">Arte y Cultura</option>
                                <option value="negocios">Negocios</option>
                                <option value="deportes">Deportes</option>
                            </Input>
                        </div>
                        <div>
                            <Label htmlFor="organizer">Organizador</Label>
                            <Input id="organizer" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required />
                        </div>
                         <div>
                            <Label htmlFor="website">Sitio Web</Label>
                            <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="imageUrl">URL de la Imagen (Opcional)</Label>
                            <Input id="imageUrl" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://picsum.photos/..." />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label>Ubicación (Haz clic en el mapa)</Label>
                        <div className="h-64 w-full rounded-md overflow-hidden border">
                           <EventMap events={dummyEventForMap} selectedEventId={'new'} onMarkerClick={()=>{}} onClick={handleMapClick} zoom={11} categories={categoriesForMap}/>
                        </div>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección o coordenadas" required />
                    </div>
                    <div className="md:col-span-2">
                        {message && <p className={cn("text-sm mb-4", message.type === 'success' ? 'text-green-600' : 'text-destructive')}>{message.text}</p>}
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? <LoaderCircle className="animate-spin h-5 w-5" /> : 'Crear Evento'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};


// --- User Management Tab ---
const UserManagement = () => {
    const { user: currentUser, isPrimaryAdmin, getAllUsers, updateUser, deleteUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }, [getAllUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (uid: string, newRole: Role) => {
        const userToUpdate = users.find(u => u.uid === uid);
        if (userToUpdate) {
            await updateUser({ ...userToUpdate, role: newRole });
            fetchUsers(); // Refresh list
        }
    };
    
    const handleDeleteUser = async (uid: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Su perfil en la base de datos será eliminado.')) {
            await deleteUser(uid);
            fetchUsers(); // Refresh list
        }
    };

    if (loading) return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin h-8 w-8" /></div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestionar Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4">Usuario</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const canEdit = isPrimaryAdmin && user.role !== Role.ADMIN_PRIMARIO && currentUser?.uid !== user.uid;
                                return (
                                <tr key={user.uid} className="border-b">
                                    <td className="p-4 font-medium">{user.displayName || 'N/A'}</td>
                                    <td className="p-4 text-muted-foreground">{user.email}</td>
                                    <td className="p-4">
                                       {canEdit ? (
                                           <Input as="select" 
                                                  value={user.role} 
                                                  onChange={(e) => handleRoleChange(user.uid, e.target.value as Role)}
                                                  className="w-48"
                                           >
                                               {Object.values(Role).map(role => (
                                                   (roleHierarchy[role] < roleHierarchy[Role.ADMIN_PRIMARIO]) &&
                                                   <option key={role} value={role}>{role}</option>
                                               ))}
                                           </Input>
                                       ) : (
                                           <span className="px-2 py-1 bg-secondary rounded">{user.role}</span>
                                       )}
                                    </td>
                                    <td className="p-4">
                                        {canEdit && (
                                            <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.uid)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};


// --- Main Admin Page Component ---
export const AdminPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
            <Tabs defaultValue="events">
                <TabsList>
                    <TabsTrigger value="events"><CalendarPlus className="h-4 w-4 mr-2" />Gestión de Eventos</TabsTrigger>
                    <TabsTrigger value="users"><UserCog className="h-4 w-4 mr-2" />Gestión de Usuarios</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="mt-4">
                    <EventManagement />
                </TabsContent>
                <TabsContent value="users" className="mt-4">
                    <UserManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
};