import { createClient } from '@supabase/supabase-js';

export class Network {
    constructor() {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase credentials are missing. Multiplayer features will be disabled.');
            this.supabase = null;
            return;
        }

        try {
            this.supabase = createClient(supabaseUrl, supabaseAnonKey);
            this.setupRealtimeSubscriptions();
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            this.supabase = null;
        }
    }

    setupRealtimeSubscriptions() {
        if (!this.supabase) return;

        // Subscribe to airplanes table changes
        this.supabase
            .from('airplanes')
            .on('*', payload => {
                console.log('Airplane update:', payload);
                // Handle airplane updates
            })
            .subscribe();

        // Subscribe to projectiles table changes
        this.supabase
            .from('projectiles')
            .on('*', payload => {
                console.log('Projectile update:', payload);
                // Handle projectile updates
            })
            .subscribe();
    }

    updateAirplanePosition(position, rotation) {
        if (!this.supabase) return;

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
        if (!this.supabase) return;

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