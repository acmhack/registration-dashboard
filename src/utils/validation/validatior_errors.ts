

export const INCORRECT_TYPE = (exp: string, got: string) => 
    `Incorrect input type. Expected ${exp}, got ${got}.`;

export const NUMBER_TOO_SMALL = (min: number) => 
    `Value entered is too small. Must be at least ${min}.`;
export const NUMBER_TOO_LARGE = (max: number) => 
    `Value entered is too large. Must be at most ${max}.`;

export const STRING_TOO_SMALL = (min: number) => 
    `Value entered is too short. Must be at least ${min} characters.`;
export const STRING_TOO_LARGE = (max: number) => 
    `Value entered is too long. Must be at most ${max} characters.`;

export const NUMBER_NOT_INT = () =>
    `Number must be an integer`;

export const DOES_NOT_MATCH = () => 
    `Incorrect data entered`;

export const INVALID_ENUM = (e: string) =>
    `Invalid option ${e}`;
