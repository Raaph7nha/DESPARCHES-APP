import { Event, User, Role } from '../types';

export type MockEvent = Omit<Event, 'date'> & { date: Date };

export const initialUsers: Omit<User, 'password'>[] = [
  {
    uid: 'admin001',
    email: 'admin01@gmail.com',
    displayName: 'Rafael Ricardo',
    photoURL: `https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff`,
    role: Role.ADMIN_PRIMARIO,
    favoriteCategories: ['musica', 'arte'],
  },
  {
    uid: 'user001',
    email: 'usuario@example.com',
    displayName: 'Usuario de Prueba',
    photoURL: `https://ui-avatars.com/api/?name=Test+User&background=random`,
    role: Role.USUARIO,
    favoriteCategories: ['gastronomia'],
  },
];

const now = new Date();
const createDate = (daysToAdd: number, hour: number, minute: number = 0) => {
    const date = new Date();
    date.setDate(now.getDate() + daysToAdd);
    date.setHours(hour, minute, 0, 0);
    return date;
};

export const initialEvents: MockEvent[] = [
  {
    id: 'evt001',
    title: 'Concierto de Rock Sinfónico',
    description: 'Una noche épica con las mejores bandas de rock interpretando sus éxitos con una orquesta sinfónica completa. ¡No te lo puedes perder!',
    date: createDate(7, 20),
    imageUrl: 'https://picsum.photos/seed/rock/400/300',
    location: { lat: 4.6583, lng: -74.0622, address: 'Movistar Arena, Bogotá' },
    category: 'musica',
    organizer: 'Live Events Co.',
    website: 'https://example.com/concierto-rock',
  },
  {
    id: 'evt002',
    title: 'Festival Gastronómico "Alimentarte"',
    description: 'Explora la cocina de más de 20 países en un solo lugar. Food trucks, música en vivo y actividades para toda la familia.',
    date: createDate(10, 12),
    imageUrl: 'https://picsum.photos/seed/food/400/300',
    location: { lat: 4.658, lng: -74.093, address: 'Parque Simón Bolívar, Bogotá' },
    category: 'gastronomia',
    organizer: 'Corazón Verde',
    website: 'https://example.com/festival-gastronomico',
  },
  {
    id: 'evt003',
    title: 'Exposición de Botero',
    description: 'Sumérgete en el mundo del arte con obras del maestro Fernando Botero, el artista colombiano más reconocido a nivel mundial.',
    date: createDate(15, 10),
    imageUrl: 'https://picsum.photos/seed/art/400/300',
    location: { lat: 4.600, lng: -74.072, address: 'Museo Botero, La Candelaria' },
    category: 'arte',
    organizer: 'Banco de la República',
    website: 'https://example.com/expo-arte',
  },
   {
    id: 'evt004',
    title: 'Noche de Cine al Aire Libre: Clásicos de los 80',
    description: 'Revive la magia de los 80s bajo las estrellas. Trae tu manta y disfruta de una película icónica en pantalla gigante.',
    date: createDate(5, 19),
    imageUrl: 'https://picsum.photos/seed/cine/400/300',
    location: { lat: 4.704, lng: -74.047, address: 'Parque de la 93, Bogotá' },
    category: 'cine',
    organizer: 'CineBajoLasEstrellas',
    website: 'https://example.com/cine-aire-libre',
  },
  {
    id: 'evt005',
    title: 'Colombia Startup & Investor Summit',
    description: 'Aprende de los líderes de la industria sobre las últimas tendencias en marketing digital, e-commerce y startups.',
    date: createDate(20, 9),
    imageUrl: 'https://picsum.photos/seed/business/400/300',
    location: { lat: 4.667, lng: -74.05, address: 'Cámara de Comercio de Bogotá, Sede Salitre' },
    category: 'negocios',
    organizer: 'InnovaTech',
    website: 'https://example.com/conferencia-digital',
  },
  {
    id: 'evt006',
    title: 'Final Liga BetPlay: Millonarios vs Santa Fe',
    description: 'El clásico capitalino más esperado del año. Vive la pasión del fútbol en el estadio El Campín. ¿Quién se llevará la estrella?',
    date: createDate(12, 17),
    imageUrl: 'https://picsum.photos/seed/futbol/400/300',
    location: { lat: 4.647, lng: -74.076, address: 'Estadio El Campín, Bogotá' },
    category: 'deportes',
    organizer: 'Dimayor',
    website: 'https://example.com/final-futbol',
  },
  {
    id: 'evt007',
    title: 'Baum Festival 2024',
    description: 'El festival de música electrónica más grande de Colombia regresa con un lineup internacional de primer nivel. ¡Prepárate para bailar sin parar!',
    date: createDate(25, 16),
    imageUrl: 'https://picsum.photos/seed/techno/400/300',
    location: { lat: 4.678, lng: -74.043, address: 'Corferias, Bogotá' },
    category: 'musica',
    organizer: 'Páramo Presenta',
    website: 'https://example.com/baum-festival',
  },
  {
    id: 'evt008',
    title: 'Bogotá Wine & Food Festival',
    description: 'Degusta los mejores vinos y platos de chefs reconocidos. Clases de cocina, catas y maridajes en un ambiente exclusivo.',
    date: createDate(18, 18),
    imageUrl: 'https://picsum.photos/seed/wine/400/300',
    location: { lat: 4.685, lng: -74.048, address: 'Club El Nogal, Bogotá' },
    category: 'gastronomia',
    organizer: 'Gourmet Experience',
    website: 'https://example.com/wine-food-fest',
  },
  {
    id: 'evt009',
    title: 'Ciclovía Nocturna',
    description: 'Recorre las calles de Bogotá en bicicleta bajo la luna. Disfruta de la ciudad de una manera diferente y saludable.',
    date: createDate(9, 18),
    imageUrl: 'https://picsum.photos/seed/bike/400/300',
    location: { lat: 4.653, lng: -74.083, address: 'Principales vías de Bogotá' },
    category: 'deportes',
    organizer: 'IDRD',
    website: 'https://example.com/ciclovia-nocturna',
  },
  {
    id: 'evt010',
    title: 'Feria Internacional del Libro de Bogotá (FILBo)',
    description: 'El evento cultural más importante del país. Encuentros con autores, lanzamientos de libros y una inmensa oferta editorial.',
    date: createDate(30, 10),
    imageUrl: 'https://picsum.photos/seed/books/400/300',
    location: { lat: 4.628, lng: -74.064, address: 'Corferias, Bogotá' },
    category: 'arte',
    organizer: 'Cámara Colombiana del Libro',
    website: 'https://example.com/filbo',
  },
  {
    id: 'evt011',
    title: 'Festival de Jazz al Parque',
    description: 'Disfruta de un fin de semana con los mejores exponentes del jazz a nivel nacional e internacional. Evento gratuito.',
    date: createDate(14, 14),
    imageUrl: 'https://picsum.photos/seed/jazz/400/300',
    location: { lat: 4.701, lng: -74.053, address: 'Parque El Country, Bogotá' },
    category: 'musica',
    organizer: 'Idartes',
    website: 'https://example.com/jazz-al-parque',
  },
  {
    id: 'evt012',
    title: 'Bogotá Fashion Week',
    description: 'La plataforma más importante de la moda en Colombia. Pasarelas, ruedas de negocios y showrooms con lo mejor del diseño local.',
    date: createDate(22, 11),
    imageUrl: 'https://picsum.photos/seed/fashion/400/300',
    location: { lat: 4.646, lng: -74.056, address: 'Ágora Bogotá' },
    category: 'negocios',
    organizer: 'Cámara de Comercio de Bogotá',
    website: 'https://example.com/bfw',
  },
  {
    id: 'evt013',
    title: 'Burger Master',
    description: 'La competencia para encontrar la mejor hamburguesa de la ciudad. Prueba las creaciones de los mejores restaurantes a un precio especial.',
    date: createDate(28, 12),
    imageUrl: 'https://picsum.photos/seed/burger/400/300',
    location: { lat: 4.6, lng: -74.06, address: 'Varios restaurantes en Bogotá' },
    category: 'gastronomia',
    organizer: 'Tulio Recomienda',
    website: 'https://example.com/burger-master',
  },
  {
    id: 'evt014',
    title: 'Media Maratón de Bogotá',
    description: 'La carrera atlética más importante de Colombia. Únete a miles de corredores en un recorrido por el corazón de la ciudad.',
    date: createDate(35, 7),
    imageUrl: 'https://picsum.photos/seed/running/400/300',
    location: { lat: 4.658, lng: -74.093, address: 'Salida Parque Simón Bolívar' },
    category: 'deportes',
    organizer: 'Correcaminos Colombia',
    website: 'https://example.com/mmb',
  },
  {
    id: 'evt015',
    title: 'Estéreo Picnic: Presenta The Killers',
    description: 'La icónica banda de rock alternativo llega a Bogotá para una noche inolvidable como parte del Festival Estéreo Picnic.',
    date: createDate(40, 19),
    imageUrl: 'https://picsum.photos/seed/killers/400/300',
    location: { lat: 4.658, lng: -74.093, address: 'Campo de Golf Briceño 18' },
    category: 'musica',
    organizer: 'Páramo Presenta',
    website: 'https://example.com/estereo-picnic',
  },
  {
    id: 'evt016',
    title: 'IndieBo: Festival de Cine Independiente',
    description: 'Descubre las nuevas voces del cine mundial con una selección de películas innovadoras y arriesgadas.',
    date: createDate(45, 15),
    imageUrl: 'https://picsum.photos/seed/indie/400/300',
    location: { lat: 4.665, lng: -74.055, address: 'Cine Tonalá, Bogotá' },
    category: 'cine',
    organizer: 'IndieBo',
    website: 'https://example.com/indiebo',
  },
  {
    id: 'evt017',
    title: 'SOFA: Salón del Ocio y la Fantasía',
    description: 'El universo del entretenimiento, los hobbies y la cultura geek en un solo lugar. Cosplay, videojuegos, comics y más.',
    date: createDate(50, 10),
    imageUrl: 'https://picsum.photos/seed/sofa/400/300',
    location: { lat: 4.628, lng: -74.064, address: 'Corferias, Bogotá' },
    category: 'arte',
    organizer: 'Corferias',
    website: 'https://example.com/sofa',
  },
  {
    id: 'evt018',
    title: 'Tour de Francia: L\'Étape Colombia',
    description: 'Vive la experiencia del Tour de Francia en las carreteras colombianas. Un reto para ciclistas aficionados de todos los niveles.',
    date: createDate(60, 6),
    imageUrl: 'https://picsum.photos/seed/letape/400/300',
    location: { lat: 4.813, lng: -74.03, address: 'Villa de Leyva (Cerca a Bogotá)' },
    category: 'deportes',
    organizer: 'ASO',
    website: 'https://example.com/letape-colombia',
  },
  {
    id: 'evt019',
    title: 'Andina Link - Feria de Telecomunicaciones',
    description: 'El punto de encuentro para los profesionales de la industria de las telecomunicaciones y las TIC en Latinoamérica.',
    date: createDate(55, 9),
    imageUrl: 'https://picsum.photos/seed/telecom/400/300',
    location: { lat: 4.678, lng: -74.043, address: 'Centro de Convenciones Ágora' },
    category: 'negocios',
    organizer: 'Andina Link',
    website: 'https://example.com/andinalink',
  },
  {
    id: 'evt020',
    title: 'Mercado de las Pulgas de San Alejo',
    description: 'Encuentra tesoros, antigüedades, artesanías y objetos únicos en el mercado de pulgas más tradicional de Bogotá.',
    date: createDate(11, 9),
    imageUrl: 'https://picsum.photos/seed/fleamarket/400/300',
    location: { lat: 4.603, lng: -74.07, address: 'Carrera 7 con Calle 24, Bogotá' },
    category: 'arte',
    organizer: 'Comunidad de Artesanos',
    website: 'https://example.com/pulgas-san-alejo',
  },
  {
    id: 'evt021',
    title: 'Rock al Parque',
    description: 'El festival de rock gratuito más grande de Hispanoamérica. Tres días de pura energía con bandas nacionales e internacionales.',
    date: createDate(65, 14),
    imageUrl: 'https://picsum.photos/seed/rockparque/400/300',
    location: { lat: 4.658, lng: -74.093, address: 'Parque Simón Bolívar, Bogotá' },
    category: 'musica',
    organizer: 'Idartes',
    website: 'https://example.com/rock-al-parque',
  },
  {
    id: 'evt022',
    title: 'Comic Con Colombia',
    description: 'La convención anual de cultura pop. Conoce a tus artistas favoritos, participa en concursos de cosplay y descubre lo último en entretenimiento.',
    date: createDate(70, 10),
    imageUrl: 'https://picsum.photos/seed/comiccon/400/300',
    location: { lat: 4.628, lng: -74.064, address: 'Corferias, Bogotá' },
    category: 'arte',
    organizer: 'Planet Comics',
    website: 'https://example.com/comiccon-colombia',
  },
  {
    id: 'evt023',
    title: 'Club Colombia Oktoberfest',
    description: 'La celebración alemana más grande de Colombia. Disfruta de una gran variedad de cervezas, comida típica y música en vivo.',
    date: createDate(75, 12),
    imageUrl: 'https://picsum.photos/seed/oktoberfest/400/300',
    location: { lat: 4.75, lng: -74.09, address: 'Club Nimajay, Bogotá' },
    category: 'gastronomia',
    organizer: 'Bavaria',
    website: 'https://example.com/oktoberfest',
  },
  {
    id: 'evt024',
    title: 'Salsa al Parque',
    description: 'Un fin de semana para bailar al ritmo de las mejores orquestas de salsa de Colombia y el mundo. ¡Entrada libre!',
    date: createDate(80, 15),
    imageUrl: 'https://picsum.photos/seed/salsa/400/300',
    location: { lat: 4.658, lng: -74.093, address: 'Parque Simón Bolívar, Bogotá' },
    category: 'musica',
    organizer: 'Idartes',
    website: 'https://example.com/salsa-al-parque',
  },
  {
    id: 'evt025',
    title: 'Obra de Teatro: "La Casa de Bernarda Alba"',
    description: 'Una poderosa puesta en escena del clásico de Federico García Lorca. Vive la intensidad del drama en el icónico Teatro Colón.',
    date: createDate(85, 19, 30),
    imageUrl: 'https://picsum.photos/seed/teatro/400/300',
    location: { lat: 4.598, lng: -74.074, address: 'Teatro Colón, Bogotá' },
    category: 'arte',
    organizer: 'Teatro Nacional',
    website: 'https://example.com/teatro-colon',
  },
];

// --- Procedural Event Generation ---
const categories = ['musica', 'gastronomia', 'cine', 'arte', 'negocios', 'deportes'];
const eventNouns: { [key: string]: string[] } = {
    musica: ['Concierto', 'Festival', 'Toque', 'Recital', 'Jam Session', 'Show Acústico'],
    gastronomia: ['Festival', 'Feria', 'Tour Culinario', 'Cata', 'Mercado Gourmet', 'Brunch Especial'],
    cine: ['Proyección', 'Festival', 'Maratón de Cine', 'Estreno Exclusivo', 'Cine-Foro', 'Ciclo de Cine'],
    arte: ['Exposición', 'Galería', 'Taller Creativo', 'Performance', 'Subasta de Arte', 'Muestra Colectiva'],
    negocios: ['Conferencia', 'Cumbre', 'Seminario', 'Rueda de Negocios', 'Taller de Emprendimiento', 'Networking'],
    deportes: ['Torneo', 'Campeonato', 'Carrera 5k', 'Maratón', 'Partido Amistoso', 'Exhibición']
};
const adjectives = ['Gran', 'Internacional', 'Anual', 'Urbano', 'Clásico', 'Exclusivo', 'Innovador', 'Familiar', 'Nocturno', 'Cultural'];
const organizers = ['Páramo Presenta', 'Ocesa Colombia', 'Idartes', 'Corferias', 'Cámara de Comercio de Bogotá', 'Live Events Co.', 'Gourmet Experience', 'InnovaTech', 'Cultura Viva', 'Pro-Deportes SAS', 'Cine Colombia', 'Bogotá Events'];
const venueTypes = ['Centro de Convenciones', 'Teatro', 'Parque', 'Estadio', 'Auditorio', 'Galería de Arte', 'Club Social', 'Plaza Pública', 'Restaurante Exclusivo', 'Hotel Boutique'];
const streetNames = ['del Sol', 'de la Luna', 'Central', 'Norte', 'del Río', 'de los Artistas', 'de la Innovación', 'Principal', 'de la República', 'de la Cultura'];

const bogotaBounds = {
    lat: { min: 4.5, max: 4.8 },
    lng: { min: -74.15, max: -74.02 }
};

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number): number => Math.random() * (max - min) + min;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

for (let i = 26; i <= 100; i++) {
    const category = getRandom(categories);
    const noun = getRandom(eventNouns[category]);
    const adj = getRandom(adjectives);
    const title = `${adj} ${noun} de ${capitalize(category)}`;

    const lat = getRandomNumber(bogotaBounds.lat.min, bogotaBounds.lat.max);
    const lng = getRandomNumber(bogotaBounds.lng.min, bogotaBounds.lng.max);
    const address = `${getRandom(venueTypes)} ${getRandom(streetNames)}, Bogotá`;

    const newEvent: MockEvent = {
        id: `evt${String(i).padStart(3, '0')}`,
        title: title,
        description: `Un evento imperdible para los amantes de ${category}. Disfruta de una experiencia única con ${noun.toLowerCase()}s de primer nivel en el corazón de la ciudad.`,
        date: createDate(Math.floor(getRandomNumber(1, 180)), Math.floor(getRandomNumber(9, 22)), getRandom([0, 30])),
        imageUrl: `https://picsum.photos/seed/${title.split(' ').join('')}${i}/400/300`,
        location: { lat, lng, address },
        category: category,
        organizer: getRandom(organizers),
        website: `https://example.com/evento-${i}`,
    };
    initialEvents.push(newEvent);
}