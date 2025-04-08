import { createClient } from '@supabase/supabase-js';

export class Network {
    constructor() {
        console.log('Initializing Network...');
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        console.log('Supabase URL:', supabaseUrl);
        console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase credentials are missing. Multiplayer features will be disabled.');
            this.supabase = null;
            return;
        }

        try {
            console.log('Creating Supabase client...');
            this.supabase = createClient(supabaseUrl, supabaseAnonKey);
            console.log('Supabase client created successfully');
            
            // Test the connection
            this.testConnection();
            
            this.setupRealtimeSubscriptions();
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            this.supabase = null;
        }
    }

    async testConnection() {
        try {
            console.log('Testing Supabase connection...');
            const { data, error } = await this.supabase.from('airplanes').select('*').limit(1);
            
            if (error) {
                console.error('Supabase connection test failed:', error);
                throw error;
            }
            
            console.log('Supabase connection test successful');
        } catch (error) {
            console.error('Error testing Supabase connection:', error);
            throw error;
        }
    }

    setupRealtimeSubscriptions() {
        if (!this.supabase) {
            console.warn('Cannot setup subscriptions: Supabase client is not initialized');
            return;
        }

        console.log('Setting up realtime subscriptions...');

        // Subscribe to airplanes table changes
        this.supabase
            .from('airplanes')
            .on('*', payload => {
                console.log('Airplane update:', payload);
                // Handle airplane updates
            })
            .subscribe((status) => {
                console.log('Airplanes subscription status:', status);
            });

        // Subscribe to projectiles table changes
        this.supabase
            .from('projectiles')
            .on('*', payload => {
                console.log('Projectile update:', payload);
                // Handle projectile updates
            })
            .subscribe((status) => {
                console.log('Projectiles subscription status:', status);
            });
    }

    updateAirplanePosition(position, rotation) {
        if (!this.supabase) {
            console.warn('Cannot update airplane position: Supabase client is not initialized');
            return;
        }

        this.supabase
            .from('airplanes')
            .upsert({
                position_x: position.x,
                position_y: position.y,
                position_z: position.z,
                rotation_x: rotation.x,
                rotation_y: rotation.y,
                rotation_z: rotation.z
            })
            .then(response => {
                if (response.error) {
                    console.error('Error updating airplane position:', response.error);
                }
            });
    }

    fireProjectile(position, direction) {
        if (!this.supabase) {
            console.warn('Cannot fire projectile: Supabase client is not initialized');
            return;
        }

        this.supabase
            .from('projectiles')
            .insert({
                position_x: position.x,
                position_y: position.y,
                position_z: position.z,
                direction_x: direction.x,
                direction_y: direction.y,
                direction_z: direction.z,
                timestamp: new Date().toISOString()
            })
            .then(response => {
                if (response.error) {
                    console.error('Error firing projectile:', response.error);
                }
            });
    }
} 