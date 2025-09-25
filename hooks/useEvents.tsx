import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '../types';
import { initialEvents, MockEvent } from '../data/mock-data';

const EVENTS_KEY = 'desparches_events';

interface EventsContextType {
    events: Event[];
    loading: boolean;
    addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
}

const EventsContext = createContext<EventsContextType>({
    events: [],
    loading: true,
    addEvent: async () => {},
});

// Helper para convertir la fecha del mock a un string ISO
const convertMockToEvent = (mockEvent: MockEvent): Event => {
    const { date, ...rest } = mockEvent;
    return {
        ...rest,
        date: date.toISOString(),
    };
};

export const EventsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const eventsJson = localStorage.getItem(EVENTS_KEY);
            if (eventsJson) {
                setEvents(JSON.parse(eventsJson));
            } else {
                // Si no hay nada en el localStorage, inicializa con los datos de mock
                const formattedInitialEvents = initialEvents.map(convertMockToEvent);
                localStorage.setItem(EVENTS_KEY, JSON.stringify(formattedInitialEvents));
                setEvents(formattedInitialEvents);
            }
        } catch (error) {
            console.error("Fallo al cargar eventos desde localStorage:", error);
            // Fallback a los datos iniciales en memoria si hay un error
            const formattedInitialEvents = initialEvents.map(convertMockToEvent);
            setEvents(formattedInitialEvents);
        } finally {
            setLoading(false);
        }
    }, []);

    const addEvent = async (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            id: `evt_${Date.now()}`,
            ...eventData
        };
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));
    };

    return (
        <EventsContext.Provider value={{ events, loading, addEvent }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => useContext(EventsContext);