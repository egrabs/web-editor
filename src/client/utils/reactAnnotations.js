/* eslint-disable no-else-return */

import uuid from 'uuid/v4';

/** rather than modify the collection passed in
* this function assumes it's immutable and returns
* new objects / arrays
*/
export default function annotateWithReactKeys(collection) {
    if (Array.isArray(collection)) {
        return collection.map(item => annotateWithReactKeys(item));
    } else if (typeof collection === 'object') {
        const newObj = {};
        Object.getOwnPropertyNames(collection)
            .forEach((prop) => {
                newObj[prop] = annotateWithReactKeys(collection[prop]);
            });
        newObj.reactKey = uuid();
        return newObj;
    }
    return collection;
}
