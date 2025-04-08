import { createClient } from '@supabase/supabase-js';

export class Network {
    constructor() {
        // Initialize Supabase client with environment variables
        this.supabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        
        this.setupRealtimeSubscriptions();
    }

    setupRealtimeSubscriptions() {
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