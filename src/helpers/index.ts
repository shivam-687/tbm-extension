import Url from 'url-parse';

export function getFaviconUrl(url: string, size?: number) {
    const url1 = new Url(url);
    return `https://www.google.com/s2/favicons?domain=${url1.origin}&sz=${size || 48}
    `
}

