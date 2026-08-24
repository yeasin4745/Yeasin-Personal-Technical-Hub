import type { IncomingMessage, ServerResponse } from 'http';
import { processContactRequest, ResponseLike } from '../src/server/contactHandler';
import { RequestLike } from '../src/server/clientMetadata';

/**
 * Vercel Serverless Function Handler for /api/contact
 */
export default async function handler(req: any, res: any) {
  let body = req.body;

  // If body is not already parsed by Vercel serverless middleware, parse it with strict 20KB limit
  if (!body && req.method === 'POST') {
    try {
      body = await new Promise((resolve, reject) => {
        let raw = '';
        let totalBytes = 0;
        const maxBytes = 20 * 1024; // 20KB

        req.on('data', (chunk: Buffer | string) => {
          totalBytes += typeof chunk === 'string' ? Buffer.byteLength(chunk) : chunk.length;
          if (totalBytes > maxBytes) {
            reject(new Error('Payload Too Large'));
            return;
          }
          raw += chunk;
        });

        req.on('end', () => {
          try {
            resolve(raw ? JSON.parse(raw) : {});
          } catch (e) {
            reject(e);
          }
        });

        req.on('error', (err: any) => reject(err));
      });
    } catch (err: any) {
      if (err.message === 'Payload Too Large') {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        return res.status(413).json({
          success: false,
          error: 'Payload Too Large. Maximum allowed size is 20KB.',
        });
      }
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.status(400).json({
        success: false,
        error: 'Malformed JSON payload.',
      });
    }
  }

  // Wrap res in ResponseLike if necessary
  const responseAdapter: ResponseLike = {
    setHeader: (name: string, value: string | string[]) => res.setHeader(name, value),
    status: (code: number) => {
      res.status(code);
      return responseAdapter;
    },
    json: (data: unknown) => res.json(data),
    send: (data: unknown) => res.send ? res.send(data) : res.end(data),
    end: () => res.end(),
  };

  const requestAdapter: RequestLike = {
    headers: req.headers || {},
    url: req.url,
    originalUrl: req.originalUrl || req.url,
    method: req.method,
    socket: req.socket,
  };

  await processContactRequest(requestAdapter, responseAdapter, body || {});
}
