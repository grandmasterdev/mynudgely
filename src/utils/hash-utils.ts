import { createHash } from 'crypto';

/**
 * Hash a string
 * @param input 
 * @returns 
 */
export const hashString = (input: string): string => {
    return createHash('sha256').update(input).digest('hex');
}