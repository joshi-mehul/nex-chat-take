let counter = 0;
export const nextId = (prefix = "id") => `${prefix}-${++counter}`;
