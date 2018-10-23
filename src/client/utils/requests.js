/* eslint-disable func-names, consistent-return, default-case */

import config from '../config/config';

const { server: { baseUrl } } = config;

function buildUrl(path, queryString = '') {
    const sepChar = path.startsWith('/') ? '' : '/';
    return `${baseUrl}${sepChar}${path}${queryString}`;
}

function addPostBody(path) {
    return function (bodyObj, otherOptions = {}) {
        this.options = Object.assign(
            this.options,
            {
                body: JSON.stringify(bodyObj),
            },
            otherOptions,
        );
        return fetch(buildUrl(path), this.options);
    };
}

function encodeQueryString(body) {
    const keys = Object.getOwnProperties(body);
    if (keys.length < 1) {
        return '';
    }

    let queryString = '?';

    // slightly more slick
    queryString += keys.map(prop => `${encodeURIComponent(prop)}=${encodeURIComponent(body[prop])}`)
        .join('&');

    // keys.forEach((prop, index) => {
    //     queryString += `${encodeURIComponent(prop)}=${encodeURIComponent(body[prop])}`;
    //     if (index < keys.length - 1) {
    //         queryString += '&';
    //     }
    // });

    return queryString;
}

function addGetBody(path) {
    return function (bodyObj, otherOptions = {}) {
        this.options = Object.assign(this.options, otherOptions);
        const queryString = encodeQueryString(bodyObj);
        return fetch(buildUrl(path, queryString), this.options);
    };
}

function POST(path) {
    const pseudoRequest = {
        options: {
            mode: 'cors',
            method: 'POST',
        },
    };
    pseudoRequest.body = addPostBody(path).bind(pseudoRequest);
    return pseudoRequest;
}

function GET(path) {
    const pseudoRequest = {
        options: {
            mode: 'cors',
            method: 'GET',
        },
    };
    pseudoRequest.body = addGetBody(path).bind(this);
    return pseudoRequest;
}

// TODO: should probably support PUT too whenever it comes up
const supportedTypes = ['GET', 'POST'];
export default function request(type, path) {
    const upperType = type.toUpperCase();
    if (!supportedTypes.includes(upperType)) {
        throw new Error(`${type} requests are not supported!`);
    }
    switch (upperType) {
    case 'POST':
        return POST(path);
    case 'GET':
        return GET(path);
    }
}
