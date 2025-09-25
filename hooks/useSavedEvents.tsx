import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedEventsContextType {
    savedEventIds: string[];
    isEventSaved: (eventId: string) => boolean;
    toggleSaveEvent: (eventId: string) => void;
}

const SavedEventsContext = createContext<SavedEventsContextType>({
    savedEventIds: [],
    isEventSaved: () => false,
    toggleSaveEvent: () => {},
});

export const SavedEventsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
        try {
            const item = window.localStorage.getItem('savedEvents');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('savedEvents', JSON.stringify(savedEventIds));
        } catch (error) {
            console.error(error);
        }
    }, [savedEventIds]);

    const isEventSaved = (eventId: string) => savedEventIds.includes(eventId);

    const toggleSaveEvent = (eventId: string) => {
        setSavedEventIds(prevIds => {
            if (prevIds.includes(eventId)) {
                return prevIds.filter(id => id !== eventId);
            } else {
                return [...prevIds, eventId];
            }
        });
    };
    
    return (
        <SavedEventsContext.Provider value={{ savedEventIds, isEventSaved, toggleSaveEvent }}>
            {children}
        </SavedEventsContext.Provider>
    );
};

export const useSavedEvents = () => useContext(SavedEventsContext);