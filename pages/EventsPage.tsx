import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Event, EventCategory } from '../types';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { useEvents } from '../hooks/useEvents';
import { EventMap } from '../components/EventMap';
import { Button, Calendar, Card, CardContent, CardTitle, Popover, PopoverContent, PopoverTrigger, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, ToggleGroup, ToggleGroupItem, cn } from '../components/ui';
import { Music, Utensils, Clapperboard, Palette, BarChart, Bookmark, CalendarDays, ExternalLink, LoaderCircle, MapPin, Trophy, Map, List } from '../components/Icons';

const categories: EventCategory[] = [
    { id: 'musica', name: 'Música', icon: Music, color: '#3b82f6' },
    { id: 'gastronomia', name: 'Gastronomía', icon: Utensils, color: '#f97316' },
    { id: 'cine', name: 'Cine', icon: Clapperboard, color: '#8b5cf6' },
    { id: 'arte', name: 'Arte y Cultura', icon: Palette, color: '#ec4899' },
    { id: 'deportes', name: 'Deportes', icon: Trophy, color: '#ef4444' },
    { id: 'negocios', name: 'Negocios', icon: BarChart, color: '#10b981' },
];

const EventCard = ({ event, onSelect, isSelected }: React.PropsWithChildren<{ event: Event, onSelect: () => void, isSelected: boolean }>) => {
    const { isEventSaved, toggleSaveEvent } = useSavedEvents();
    const saved = isEventSaved(event.id);
    const categoryColor = categories.find(c => c.id === event.category)?.color || '#6b7280';

    return (
        <Card 
            className={cn("cursor-pointer transition-all hover:shadow-md", isSelected ? "ring-2" : "border")}
            style={{ borderColor: isSelected ? categoryColor : undefined, '--ring-color': isSelected ? categoryColor : 'transparent' } as React.CSSProperties}
            onClick={onSelect}
        >
            <div className="flex">
                <div className="w-4 h-auto rounded-l-lg" style={{ backgroundColor: categoryColor }}></div>
                <img src={event.imageUrl} alt={event.title} className="h-32 w-32 object-cover" />
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                        <CardTitle className="text-base mb-1 truncate">{event.title}</CardTitle>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                           <CalendarDays className="h-4 w-4" /> 
                           {new Date(event.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                           <MapPin className="h-4 w-4" /> 
                           <span className="truncate">{event.location.address}</span>
                        </div>
                    </div>
                     <Button 
                        size="sm" 
                        variant={saved ? 'default' : 'outline'}
                        className="mt-2 w-fit"
                        onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                    >
                        <Bookmark className="h-4 w-4 mr-2" />
                        {saved ? 'Guardado' : 'Guardar'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export const EventsPage = () => {
    const { events, loading } = useEvents();
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    // Filters
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [showSaved, setShowSaved] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // View state
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [mapCenter, setMapCenter] = useState({ lat: 4.60971, lng: -74.08175 }); // Bogota
    
    const { savedEventIds, isEventSaved, toggleSaveEvent } = useSavedEvents();
    const navigate = useNavigate();
    const location = useLocation();

    // Set initial filters from URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category');
        const search = params.get('search');
        const eventId = params.get('eventId');
        
        if (category) setCategoryFilter(category);
        if (search) setSearchTerm(search);
        if (eventId) setSelectedEventId(eventId);

    }, [location.search]);

    const filteredEvents = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return events.filter(event => {
            if (categoryFilter && event.category !== categoryFilter) return false;
            if (dateFilter && new Date(event.date).toDateString() !== dateFilter.toDateString()) return false;
            if (showSaved && !savedEventIds.includes(event.id)) return false;
            if (searchTerm && !(
                event.title.toLowerCase().includes(lowercasedSearchTerm) ||
                event.description.toLowerCase().includes(lowercasedSearchTerm) ||
                event.location.address.toLowerCase().includes(lowercasedSearchTerm)
            )) return false;
            return true;
        });
    }, [events, categoryFilter, dateFilter, showSaved, savedEventIds, searchTerm]);
    
    const updateURLParams = (key: string, value: string | null) => {
        const params = new URLSearchParams(location.search);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        navigate(`?${params.toString()}`, { replace: true });
    };

    const handleCategoryFilterChange = (value: string) => {
        const newCategory = categoryFilter === value ? null : value;
        setCategoryFilter(newCategory);
        updateURLParams('category', newCategory);
    };

    const selectedEvent = useMemo(() => {
        return events.find(e => e.id === selectedEventId) || null;
    }, [events, selectedEventId]);

    useEffect(() => {
        if (selectedEvent) {
            setMapCenter(selectedEvent.location);
        }
    }, [selectedEvent]);

    const handleShowOnMap = () => {
        if (selectedEvent) {
            setMapCenter(selectedEvent.location);
            setViewMode('map');
            // On mobile, close sheet to see map.
            if (window.innerWidth < 768) {
              setSelectedEventId(null);
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Map View */}
            <div className={cn(
                "relative w-full md:w-1/2 h-full",
                viewMode === 'list' && "hidden md:block"
            )}>
                <EventMap 
                    events={filteredEvents} 
                    selectedEventId={selectedEventId}
                    onMarkerClick={setSelectedEventId}
                    center={mapCenter}
                    categories={categories}
                />
                <Button onClick={() => setViewMode('list')} className="md:hidden absolute top-4 right-4 z-10 shadow-lg" size="lg">
                    <List className="h-4 w-4 mr-2" />
                    Lista
                </Button>
            </div>

            {/* List View */}
            <div className={cn(
                "w-full md:w-1/2 flex flex-col",
                viewMode === 'map' && "hidden md:flex"
            )}>
                <div className="p-4 border-b">
                     <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Eventos</h1>
                        <Button onClick={() => setViewMode('map')} className="md:hidden">
                            <Map className="h-4 w-4 mr-2" />
                            Mapa
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <ToggleGroup value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                            {categories.map(cat => (
                                <ToggleGroupItem key={cat.id} value={cat.id}><cat.icon className="h-4 w-4 mr-2"/>{cat.name}</ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4" />{dateFilter ? dateFilter.toLocaleDateString('es-ES') : 'Fecha'}</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar date={dateFilter} setDate={setDateFilter} />
                                {dateFilter && <Button variant="ghost" onClick={() => setDateFilter(undefined)} className="w-full mt-2">Limpiar</Button>}
                            </PopoverContent>
                        </Popover>
                        <Button variant={showSaved ? 'default' : 'outline'} onClick={() => setShowSaved(!showSaved)}>
                            <Bookmark className="mr-2 h-4 w-4" />Guardados
                        </Button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <LoaderCircle className="h-8 w-8 animate-spin" />
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} onSelect={() => setSelectedEventId(event.id)} isSelected={selectedEventId === event.id} />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground pt-10">No se encontraron eventos con los filtros actuales.</p>
                    )}
                </div>
            </div>

            {/* Event Detail Sheet */}
            <Sheet open={!!selectedEventId} onOpenChange={(open) => !open && setSelectedEventId(null)}>
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
                               <div className="flex items-start gap-2">
                                   <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
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
                                    <Button className="w-full" onClick={handleShowOnMap}>
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