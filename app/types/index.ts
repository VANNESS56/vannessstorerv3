export interface Product {
    id: string;
    platform: string;
    country: string;
    price: number;
    stock: number;
    icon: string; // URL icon or lucide-icon name mapped
    flag: string; // Emoji
    countryId?: string; // ID for API (e.g. '6')
    serviceCode?: string; // Service code for API (e.g. 'wa')
}
