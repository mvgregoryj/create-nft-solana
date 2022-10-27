export interface Ticket {
    number: number;
    wallet: string;
}

export interface Event {
    date: string;
    location: string;
    genre: string;
    artists: string[];
    sponsors: string[];
    website: string;
    image: string;
    tickets: Ticket[];
}