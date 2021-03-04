import { version, validate } from 'uuid';

export function validateUUID(uuid_string) {
    return validate(uuid_string) && version(uuid_string) === 4; // ⇨ false
}

function formatPhone(phoneNumber) {
    let cleaned = ('' + phoneNumber).replace(/\D/g, '');

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    };
    
    return phoneNumber
}

export {formatPhone}