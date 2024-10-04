import { v4 as uuidv4 } from 'uuid';

export const generateUniqueId = (prefix?: string) => {
    return `${prefix ?? ""}${uuidv4()}`;
};
