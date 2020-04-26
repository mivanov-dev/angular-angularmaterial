export function buildReqUrl(hasProxy: any, proxyBaseUrl: string, baseUrl: string, path: string): string {
    if (hasProxy) {
        return `${proxyBaseUrl}${path}`;
    }
    return `${baseUrl}${path}`;
}
