// services/apiService.ts
import { ApiRetryHandler } from '../utils/apiRetry';

interface ApiServiceOptions {
    onSpinUp?: () => void;
    onRetry?: (attempt: number, error: any) => void;
    onSuccess?: () => void;
}

class ApiService {
    private baseUrl: string;
    private options: ApiServiceOptions = {};

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl || (process.env.NODE_ENV === 'production'
            ? 'https://your-app.onrender.com'
            : 'http://localhost:5000'
        );
    }

    setCallbacks(options: ApiServiceOptions) {
        this.options = options;
    }

    async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await ApiRetryHandler.fetchWithRetry(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }, {
            maxRetries: 5,
            baseDelay: 3000,
            maxDelay: 30000,
            onSpinUp: this.options.onSpinUp,
            onRetry: this.options.onRetry,
        });

        if (response.ok && this.options.onSuccess) {
            this.options.onSuccess();
        }

        return response;
    }

    async get(endpoint: string): Promise<any> {
        const response = await this.request(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    async post(endpoint: string, data: any): Promise<any> {
        const response = await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    async put(endpoint: string, data: any): Promise<any> {
        const response = await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    async delete(endpoint: string): Promise<any> {
        const response = await this.request(endpoint, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Health check endpoint to wake up the service
    async ping(): Promise<boolean> {
        try {
            await this.request('/api/health', { method: 'GET' });
            return true;
        } catch {
            return false;
        }
    }
}

export const apiService = new ApiService();
