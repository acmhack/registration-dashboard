import { DOES_NOT_MATCH, INCORRECT_TYPE, INVALID_ENUM, NUMBER_NOT_INT, NUMBER_TOO_LARGE, NUMBER_TOO_SMALL, STRING_TOO_LARGE, STRING_TOO_SMALL } from "./validatior_errors";
import { Validation, Warning } from "./validator.types";

export function getValidationWarnings<T>(data: T, validator: Validation<T>, stopAtFirstWarning: boolean): Warning[] {
    const validationFields = Object.entries(validator) as [keyof T, any][];
    
    const warningList: Warning[] = [];
    for(let i = 0; i < validationFields.length; i ++) {
        // Validate this field.
        const name = validationFields[i][0], datapoint = validationFields[i][1];
        const validationForm = validator[name];
        if(!validationForm) {
            warningList.push({
                message: "No validation form found!",
                data_point: name as string,
            })
        }
        else if(typeof validationForm.type == 'object') {
            const w = getValidationWarnings(datapoint, validationForm.type, stopAtFirstWarning);
            warningList.push(...w);
        }
        else {
            switch(validationForm.type) {
                case 'custom':
                    const warning = validationForm.validate(datapoint, data);
                    if(warning) warningList.push({ message: warning, data_point: name as string });
                break;
                case 'integer':
                    if(typeof data !== 'number') warningList.push({
                        message: INCORRECT_TYPE('number', typeof data),
                        data_point: name as string
                    });
                    else if(data !== Math.floor(data)) {
                        warningList.push({
                            message: NUMBER_NOT_INT(),
                            data_point: name as string
                        });
                    }
                    else if(validationForm.bounds) {
                        if(validationForm.bounds.min && datapoint < validationForm.bounds.min) {
                            warningList.push({
                                message: NUMBER_TOO_SMALL(validationForm.bounds.min),
                                data_point: name as string
                            });
                        }
                        else if(validationForm.bounds.max && datapoint > validationForm.bounds.max) {
                            warningList.push({
                                message: NUMBER_TOO_LARGE(validationForm.bounds.max),
                                data_point: name as string
                            });
                        }
                    }
                break;
                case 'number':
                    if(typeof data !== 'number') warningList.push({
                        message: INCORRECT_TYPE('number', typeof data),
                        data_point: name as string
                    });
                    else if(validationForm.bounds) {
                        if(validationForm.bounds.min && datapoint < validationForm.bounds.min) {
                            warningList.push({
                                message: NUMBER_TOO_SMALL(validationForm.bounds.min),
                                data_point: name as string
                            });
                        }
                        else if(validationForm.bounds.max && datapoint > validationForm.bounds.max) {
                            warningList.push({
                                message: NUMBER_TOO_LARGE(validationForm.bounds.max),
                                data_point: name as string
                            });
                        }
                    }
                break;
                case 'text':
                    if(typeof data !== 'string') warningList.push({
                        message: INCORRECT_TYPE('string', typeof data),
                        data_point: name as string
                    });
                    else if(validationForm.matchString && !data.match(validationForm.matchString)) warningList.push({
                        message: DOES_NOT_MATCH(),
                        data_point: name as string
                    });
                    else if(validationForm.length?.min && data.length < validationForm.length.min) warningList.push({
                        message: STRING_TOO_SMALL(validationForm.length.min),
                        data_point: name as string
                    });
                    else if(validationForm.length?.max && data.length < validationForm.length.max) warningList.push({
                        message: STRING_TOO_LARGE(validationForm.length.max),
                        data_point: name as string
                    });
                break;
                case 'enum':
                    if(!validationForm.options.includes(datapoint)) warningList.push({
                        message: INVALID_ENUM(datapoint),
                        data_point: name as string
                    })
                break;
                default:
                    warningList.push({
                        message: `Unrecognized validation type ${validationForm.type}`,
                        data_point: name as string
                    })
                break;
            }
        }
        if(stopAtFirstWarning && warningList.length > 0) return [ warningList[0] ];
    }

    return warningList;
}

function validateData<T>(data: T, validation: Validation<T>): boolean {
    // If no warnings then no problem, right?
    return getValidationWarnings(data, validation, true).length === 0;
}
export default validateData;

