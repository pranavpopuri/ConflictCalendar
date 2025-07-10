// utils/apiRetry.ts
interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: any) => void;
    onSpinUp?: () => void;
}

export class ApiRetryHandler {
    private static isSpinningUp = false;
    private static spinUpCallbacks: (() => void)[] = [];

    static async fetchWithRetry(
        url: string,
        options: RequestInit = {},
        retryOptions: RetryOptions = {}
    ): Promise<Response> {
        const {
            maxRetries = 5,
            baseDelay = 2000,
            maxDelay = 30000,
            onRetry,
            onSpinUp
        } = retryOptions;

        let lastError: any;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: AbortSignal.timeout(attempt === 0 ? 10000 : 30000) // Longer timeout for retries
                });

                // Success - clear spin up state
                if (response.ok) {
                    if (this.isSpinningUp) {
                        this.isSpinningUp = false;
                        this.spinUpCallbacks.forEach(cb => cb());
                        this.spinUpCallbacks = [];
                    }
                    return response;
                }

                // Check for spin-down indicators
                if (this.isSpinDownError(response.status)) {
                    if (!this.isSpinningUp) {
                        this.isSpinningUp = true;
                        onSpinUp?.();
                    }

                    if (attempt < maxRetries) {
                        const delay = this.calculateDelay(attempt, baseDelay, maxDelay);
                        onRetry?.(attempt + 1, { status: response.status, message: 'Service spinning up...' });
                        await this.delay(delay);
                        continue;
                    }
                }

                // Other errors - don't retry as aggressively
                if (attempt < Math.min(2, maxRetries)) {
                    const delay = this.calculateDelay(attempt, 1000, 5000);
                    onRetry?.(attempt + 1, { status: response.status });
                    await this.delay(delay);
                    continue;
                }

                return response;
            } catch (error) {
                lastError = error;

                // Network errors might indicate spin down
                if (this.isNetworkError(error)) {
                    if (!this.isSpinningUp) {
                        this.isSpinningUp = true;
                        onSpinUp?.();
                    }
                }

                if (attempt < maxRetries) {
                    const delay = this.calculateDelay(attempt, baseDelay, maxDelay);
                    onRetry?.(attempt + 1, error);
                    await this.delay(delay);
                }
            }
        }

        throw lastError;
    }

    private static isSpinDownError(status: number): boolean {
        // Common status codes when service is spinning down/up
        return [429, 502, 503, 504].includes(status);
    }

    private static isNetworkError(error: any): boolean {
        return error.name === 'TypeError' ||
            error.message?.includes('fetch') ||
            error.message?.includes('network');
    }

    private static calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
        // Exponential backoff with jitter
        const exponentialDelay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        return Math.min(exponentialDelay + jitter, maxDelay);
    }

    private static delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static addSpinUpCallback(callback: () => void): void {
        this.spinUpCallbacks.push(callback);
    }
}
