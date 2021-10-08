

interface SizeValidator {
    min?: number;
    max?: number;
}

export interface CustomValidator<T, U> {
    type: 'custom';
    validate: (data: T, context: U) => string | undefined;
}

export interface ValidateNumber {
    type: 'number';
    bounds?: SizeValidator;
}

export interface ValidateInt extends Omit<ValidateNumber, 'type'> {
    type: 'integer';
}

export interface ValidateText {
    type: 'text';
    length?: SizeValidator;
    matchString?: string;
}

export interface ValidateEnum {
    type: 'enum',
    options: string[]
}

export interface ValidateObject<T> {
    type: Validation<T>;
}

export interface Warning {
    data_point: string;
    message: string;
}

export const ValidatePhoneNumber: ValidateText = {
    type: 'text',
    // Matches a telephone number
    matchString: `/^(?:\\+\\d{1,3}\\D+)?(?:\\(\\d{3}\\)|\\d{3})[- ]*\\d{3}[- ]*\\d{4}$/g`
}

export type ValidationUnion = ValidateNumber | ValidateInt | ValidateText | ValidateEnum | CustomValidator<any, any> | ValidateObject<any>;

export type Validation<T> = Record<keyof T, ValidationUnion>

