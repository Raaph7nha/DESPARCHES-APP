

import React, { useEffect, useRef, useState } from 'react';
import { Event, EventCategory } from '../types';
import { LoaderCircle } from './Icons';

interface EventMapProps {
    events: Event[];
    selectedEventId: string | null;
    onMarkerClick: (eventId: string) => void;
    categories: EventCategory[];
    center?: { lat: number; lng: number };
    zoom?: number;
    interactive?: boolean;
    onClick?: (location: { lat: number, lng: number }) => void;
}

// Custom map style for "Desparches" dark theme
const mapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#4b6878" }] },
    { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#334e87" }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#023e58" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#98a5be" }] },
    { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#1d2c4d" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c6675" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#255763" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4e6d70" }] },
];


const getEmojiForCategory = (categoryId: string): string => {
    switch(categoryId) {
        case 'musica': return '🎵';
        case 'gastronomia': return '🍔';
        case 'cine': return '🎬';
        case 'arte': return '🎨';
        case 'negocios': return '💼';
        case 'deportes': return '🏆';
        default: return '🎉';
    }
};

// Function to create a colored SVG marker with an emoji
const createMarkerSVG = (emoji: string, color: string, isSelected: boolean) => {
    const scale = isSelected ? 1.3 : 1;
    // A neon-like glow for selected markers, more visible on a dark background
    const dropShadow = isSelected ? `filter: drop-shadow(0px 0px 8px ${color});` : '';
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${48 * scale}" height="${52 * scale}" viewBox="0 0 48 52" style="${dropShadow} transform-origin: bottom center; transition: all 0.2s ease-in-out;">
            <path fill="${color}" stroke="#FFFFFF" stroke-width="2" d="M24 4C14.059 4 6 12.059 6 22c0 7.42 10.8 19.85 16.5 25.14a2.98 2.98 0 0 0 3 0C31.2 41.85 42 29.42 42 22 42 12.059 33.941 4 24 4z"/>
            <text x="50%" y="45%" dominant-baseline="central" text-anchor="middle" font-size="20">${emoji}</text>
        </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};


export const EventMap = ({
    events,
    selectedEventId,
    onMarkerClick,
    categories,
    center = { lat: 4.60971, lng: -74.08175 }, // Bogota
    zoom = 12,
    interactive = true,
    onClick,
}: EventMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any | null>(null);
    const markersRef = useRef<{ [key: string]: any }>({});
    const infoWindowRef = useRef<any | null>(null);
    const clustererRef = useRef<any | null>(null);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    useEffect(() => {
        const checkApi = () => {
            // FIX: Check for MarkerClusterer library availability on the window object.
            if ((window as any).google && (window as any).google.maps && (window as any).MarkerClusterer) {
                setIsApiLoaded(true);
            } else {
                setTimeout(checkApi, 100);
            }
        };
        checkApi();
    }, []);

    useEffect(() => {
        if (!isApiLoaded || !mapRef.current) return;
        
        if (!googleMapRef.current) {
             googleMapRef.current = new (window as any).google.maps.Map(mapRef.current, {
                center,
                zoom,
                mapId: "DESPARCHES_DARK_MAP_ID",
                disableDefaultUI: !interactive,
                clickableIcons: false,
                gestureHandling: interactive ? 'auto' : 'none',
                styles: mapStyle,
             });

             infoWindowRef.current = new (window as any).google.maps.InfoWindow({
                 // Style InfoWindow for dark theme
                 pixelOffset: new (window as any).google.maps.Size(0, -10)
             });

             infoWindowRef.current.addListener('closeclick', () => {
                onMarkerClick(''); // Deselect event when user closes InfoWindow
             });
            
             if(onClick) {
                googleMapRef.current.addListener('click', (e: any) => {
                    if (e.latLng) {
                        onClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    }
                });
             }
        }
    }, [isApiLoaded, center, zoom, interactive, onClick, onMarkerClick]);

    useEffect(() => {
        if (!googleMapRef.current || !isApiLoaded) return;
        
        // Define a custom renderer for cluster icons to match the dark theme.
        const renderer = {
            render: ({ count, position }: { count: number, position: any }) => {
                return new (window as any).google.maps.Marker({
                    position,
                    label: { text: String(count), color: "white", fontSize: "12px", fontWeight: "bold" },
                    icon: {
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="18" fill="rgba(30, 64, 175, 0.8)" stroke="#fff" stroke-width="2"/>
                            </svg>`
                        )}`,
                        anchor: new (window as any).google.maps.Point(20, 20),
                        scaledSize: new (window as any).google.maps.Size(40, 40),
                    },
                    // Higher zIndex for clusters
                    zIndex: 1000 + count,
                });
            }
        };

        if (!clustererRef.current) {
            clustererRef.current = new (window as any).MarkerClusterer({ 
                map: googleMapRef.current, 
                markers: [],
                renderer,
            });
        }
        
        // Create an array of new markers from the events prop.
        markersRef.current = {};
        const newMarkers = events.map((event, index) => {
            const isSelected = event.id === selectedEventId;
            const scale = isSelected ? 1.3 : 1;
            const category = categories.find(c => c.id === event.category);
            const color = category ? category.color : '#6b7280';
            const emoji = getEmojiForCategory(event.category);
            const iconUrl = createMarkerSVG(emoji, color, isSelected);
            
            // Use legacy google.maps.Marker for compatibility with MarkerClusterer library.
            const marker = new (window as any).google.maps.Marker({
                position: event.location,
                title: event.title,
                icon: {
                    url: iconUrl,
                    // Anchor the marker at its bottom-center tip.
                    anchor: new (window as any).google.maps.Point(24 * scale, 52 * scale),
                },
                zIndex: isSelected ? 1001 : index, // Selected marker on top
            });
            
            marker.addListener('click', () => onMarkerClick(event.id));
            
            markersRef.current[event.id] = marker;
            return marker;
        });
        
        // Update the clusterer with the new set of markers.
        clustererRef.current.clearMarkers();
        clustererRef.current.addMarkers(newMarkers);


        // InfoWindow logic
        const infoWindow = infoWindowRef.current;
        if (selectedEventId) {
            const selectedMarker = markersRef.current[selectedEventId];
            const selectedEvent = events.find(e => e.id === selectedEventId);
            if (selectedMarker && selectedEvent) {
                const contentString = `
                    <div style="background-color: #020617; color: #e5e7eb; padding: 12px 16px; border-radius: 8px; font-family: sans-serif; border: 1px solid #334155;">
                        <h3 style="font-weight: 600; margin: 0 0 4px 0; font-size: 1rem; color: #ffffff;">${selectedEvent.title}</h3>
                        <p style="margin: 0; font-size: 0.875rem;">${selectedEvent.location.address}</p>
                    </div>`;
                infoWindow.setContent(contentString);
                infoWindow.open({
                    anchor: selectedMarker,
                    map: googleMapRef.current,
                });
                if (googleMapRef.current) {
                    googleMapRef.current.panTo(selectedEvent.location);
                }
            } else {
                infoWindow.close();
            }
        } else {
            infoWindow.close();
        }

    }, [events, selectedEventId, onMarkerClick, isApiLoaded, categories]);

    useEffect(() => {
        // Pan to the center from props only if no event is currently selected.
        if (googleMapRef.current && center && !selectedEventId) {
            googleMapRef.current.panTo(center);
        }
    }, [center, selectedEventId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (clustererRef.current) {
                clustererRef.current.clearMarkers();
            }
        };
    }, []);

    if (!isApiLoaded) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-muted">
                <LoaderCircle className="h-8 w-8 animate-spin" />
                <p className="ml-2">Cargando mapa...</p>
            </div>
        );
    }
    
    return <div ref={mapRef} className="h-full w-full" />;
};