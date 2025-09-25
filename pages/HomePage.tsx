import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardTitle, cn, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui';
import { Music, Utensils, Clapperboard, Palette, BarChart, Bookmark, CalendarDays, MapPin, Trophy, Map, ExternalLink } from '../components/Icons';
import { Event, EventCategory } from '../types';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { useEvents } from '../hooks/useEvents';

const categories: EventCategory[] = [
    { id: 'musica', name: 'Música', icon: Music, color: 'bg-musica' },
    { id: 'gastronomia', name: 'Gastronomía', icon: Utensils, color: 'bg-gastronomia' },
    { id: 'cine', name: 'Cine', icon: Clapperboard, color: 'bg-cine' },
    { id: 'arte', name: 'Arte y Cultura', icon: Palette, color: 'bg-arte' },
    { id: 'deportes', name: 'Deportes', icon: Trophy, color: 'bg-deportes' },
    { id: 'negocios', name: 'Negocios', icon: BarChart, color: 'bg-negocios' },
];

// FIX: Use React.PropsWithChildren for EventHighlightCard props to align with project conventions and resolve TypeScript error.
const EventHighlightCard = ({ event, onSelect }: React.PropsWithChildren<{ event: Event, onSelect: (event: Event) => void }>) => {
    const { isEventSaved, toggleSaveEvent } = useSavedEvents();
    const saved = isEventSaved(event.id);
    const categoryColor = categories.find(c => c.id === event.category)?.color.replace('bg-', 'border-') || 'border-gray-200';
    
    return (
        <Card className={cn("w-full transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border-l-4", categoryColor)} onClick={() => onSelect(event)}>
            <div className="relative">
                <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded-t-lg" />
                <Button 
                    size="icon" 
                    variant={saved ? 'default' : 'secondary'}
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                    aria-label={saved ? "Quitar de guardados" : "Guardar evento"}
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

export const HomePage = () => {
    const { events, loading } = useEvents();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { isEventSaved, toggleSaveEvent } = useSavedEvents();

    const highlightEvents = useMemo(() => {
        if (loading || events.length === 0) return [];
        // Mostrar 9 eventos aleatorios
        return [...events].sort(() => 0.5 - Math.random()).slice(0, 9);
    }, [events, loading]);


    const navigate = useNavigate();
    const handleViewOnMap = (eventId: string) => {
        setSelectedEvent(null);
        navigate(`/events?eventId=${eventId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-16">
            {/* Hero Section */}
            <section className="relative h-[50vh] rounded-lg overflow-hidden flex items-center justify-center text-center text-white bg-black">
                <img src="https://picsum.photos/1200/800?blur=5&random=1" alt="Evento" className="absolute inset-0 w-full h-full object-cover opacity-50"/>
                <div className="relative z-10 p-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Descubre los Mejores "Desparches"</h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Tu guía definitiva para encontrar los eventos más emocionantes y únicos en tu ciudad.</p>
                    <Link to="/events">
                        <Button size="lg">Explorar Eventos</Button>
                    </Link>
                </div>
            </section>

            {/* Category Filters */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-center">Explora por Categoría</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <Link key={category.id} to={`/events?category=${category.id}`}>
                            <Card className={cn("text-center p-6 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer", `hover:border-${category.id}`)}>
                                <category.icon className={cn("h-10 w-10 mx-auto mb-2", `text-${category.id}`)} />
                                <h3 className="font-semibold">{category.name}</h3>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Highlighted Events */}
            <section>
                <h2 className="text-2xl font-bold mb-6 text-center">Eventos Destacados</h2>
                {highlightEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {highlightEvents.map((event) => (
                           <EventHighlightCard key={event.id} event={event} onSelect={setSelectedEvent} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No hay eventos destacados en este momento.</p>
                )}
            </section>

             {/* Event Detail Sheet */}
             <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <SheetContent className="w-full md:w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedEvent && (
                        <>
                            <SheetHeader className="mb-4">
                               <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="h-48 w-full object-cover rounded-md mb-4" />
                                <SheetTitle className="text-2xl">{selectedEvent.title}</SheetTitle>
                                <SheetDescription>{selectedEvent.organizer}</SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4">
                               <p>{selectedEvent.description}</p>
                               <div className="flex items-center gap-2">
                                   <CalendarDays className="h-5 w-5 text-primary" />
                                   <div>
                                       <p className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                       <p className="text-sm text-muted-foreground">{new Date(selectedEvent.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                                   </div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <MapPin className="h-5 w-5 text-primary" />
                                   <p className="font-semibold">{selectedEvent.location.address}</p>
                               </div>
                               <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                    <Button 
                                       className="w-full"
                                       onClick={(e) => { e.stopPropagation(); toggleSaveEvent(selectedEvent.id); }}
                                       variant={isEventSaved(selectedEvent.id) ? 'default' : 'outline'}
                                    >
                                       <Bookmark className="h-4 w-4 mr-2" />
                                       {isEventSaved(selectedEvent.id) ? 'Quitar de guardados' : 'Guardar evento'}
                                    </Button>
                                    <Button className="w-full" onClick={() => handleViewOnMap(selectedEvent.id)}>
                                        <Map className="h-4 w-4 mr-2"/>
                                        Ver en el Mapa
                                    </Button>
                               </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};