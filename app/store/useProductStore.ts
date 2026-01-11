import { create } from 'zustand';
import { supabase } from '@/app/lib/supabaseClient';
import { Product } from '../types';

interface ProductStore {
    products: Product[];
    isLoading: boolean;

    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: string, updatedProduct: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,

    fetchProducts: async () => {
        set({ isLoading: true });
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) {
            // Map DB columns to Frontend types if needed (snake_case to camelCase)
            const mappedProducts = data.map((item: any) => ({
                id: item.id,
                platform: item.platform,
                country: item.country,
                price: item.price,
                stock: item.stock,
                icon: item.icon,
                flag: item.flag,
                countryId: item.country_id,
                serviceCode: item.service_code
            }));
            set({ products: mappedProducts, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    addProduct: async (product) => {
        // Insert to DB
        const { error } = await supabase.from('products').insert([{
            platform: product.platform,
            country: product.country,
            price: product.price,
            stock: product.stock,
            icon: product.icon,
            flag: product.flag,
            country_id: product.countryId || null,
            service_code: product.serviceCode || null
        }]);

        if (!error) {
            get().fetchProducts(); // Refresh list
        } else {
            console.error(error);
            alert(`Gagal menyimpan produk ke database: ${error.message}`);
        }
    },

    updateProduct: async (id, updatedProduct) => {
        // Prepare update object (handle camel to snake conversion if passing raw partial)
        // For simplicity assuming UI passes compatible structure or we map it
        const updatePayload: any = { ...updatedProduct };
        if (updatedProduct.countryId) updatePayload.country_id = updatedProduct.countryId;
        if (updatedProduct.serviceCode) updatePayload.service_code = updatedProduct.serviceCode;

        const { error } = await supabase.from('products').update(updatePayload).eq('id', id);

        if (!error) {
            get().fetchProducts();
        }
    },

    deleteProduct: async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
            get().fetchProducts();
        }
    }
}));
