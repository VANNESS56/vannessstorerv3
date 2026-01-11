import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.jasaotp.id/v2/';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const api_key = process.env.DITZNESIA_API_KEY; // Using the existing env var name for now to avoid confusion

        if (!api_key) {
            return NextResponse.json({ status: false, message: 'API Key Missing' }, { status: 500 });
        }

        const { endpoint, params = {} } = body;

        // Build query string
        const queryParams = new URLSearchParams({
            api_key: api_key,
            ...params
        });

        // Determine request URL based on endpoint
        const url = `${BASE_URL}${endpoint}.php?${queryParams.toString()}`;

        const res = await fetch(url, {
            method: 'GET', // JasaOTP uses GET for all requests based on docs
        });

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
