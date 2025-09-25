import React from 'react';
import { Link } from 'react-router-dom';
import { PartyPopper } from './Icons';

export const Footer = () => {
    return (
        <footer className="bg-muted text-muted-foreground mt-16 border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
                            <PartyPopper className="h-6 w-6 text-primary" />
                            Desparches
                        </Link>
                        <p className="mt-2 text-sm">Tu guía de eventos en la ciudad.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Navegación</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
                            <li><Link to="/events" className="hover:text-primary">Eventos</Link></li>
                            <li><Link to="/profile" className="hover:text-primary">Perfil</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Comunidad</h3>
                        <ul className="space-y-2">
                            <li><Link to="/reviews" className="hover:text-primary">Reseñas de la App</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">Contactar Admins</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Desparches. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
