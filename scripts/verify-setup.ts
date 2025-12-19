
import fs from 'fs';
import path from 'path';
// import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('🔍 Validating Environment Setup...');

    // 1. Load .env.local manually
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        console.log('📄 Found .env.local');
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach((line) => {
            const trimmedLine = line.trim();
            const match = trimmedLine.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^"(.*)"$/, '$1'); // Remove quotes
                process.env[key] = value;
            }
        });
    } else {
        console.error('❌ .env.local file not found!');
        process.exit(1);
    }

    // 2. Check Variables
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'DATABASE_URL',
        'DIRECT_URL'
    ];

    let missing = false;
    requiredVars.forEach(v => {
        if (!process.env[v] || process.env[v].includes('your-')) {
            console.error(`❌ Missing or placeholder value for: ${v}`);
            missing = true;
        }
    });

    if (missing) {
        console.error('⚠️  Please update .env.local with real values.');
        process.exit(1);
    }
    console.log('✅ Environment variables look correct (format-wise).');

    // 3. Test Supabase API (Anon Key)
    console.log('CONNECTING to Supabase API...');
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Simple fetch to the health check or a public endpoint
        // We'll trust that if the URL is reachable and Key doesn't crash immediately on client init, it's okay.
        // Better: fetch `${supabaseUrl}/rest/v1/` with key.
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
            headers: {
                'apikey': anonKey!,
                'Authorization': `Bearer ${anonKey}`
            }
        });

        if (response.status === 200 || response.status === 404) {
            // 200 OK or 404 (no tables) means auth worked. 
            // 401 Unauthorized means key is bad.
            console.log('✅ Supabase API connection verified.');
        } else {
            console.warn(`⚠️  Supabase API returned status ${response.status}. Key might be invalid.`);
        }

    } catch (error) {
        console.error('❌ Failed to connect to Supabase API:', error);
    }

    // 4. Test Database Connection (Prisma)
    // console.log('Skipping Database connection test (Auth/Prisma implementation postponed).');
}

main();
