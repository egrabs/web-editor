/* eslint-disable func-names, consistent-return, default-case */

import config from '../config/config';

import rootStore from '../redux/RootStore';
import { getAuthState } from '../redux/Auth/AuthReducer';
import { getAuthToken } from './auth';

const { server: { baseUrl } } = config;

const commonOpts = () => {
    const opts = {
        mode: 'cors',
        // maybe one day we'll want to send something other than JSON
        // but for now this should be fine
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const { authed } = getAuthState(rootStore.getState());
    if (authed) {
        const token = getAuthToken();
        opts.headers.Authorization = token;
    }
    return opts;
};

function buildUrl(path, queryString = '') {
    const sepChar = path.startsWith('/') ? '' : '/';
    return `${baseUrl}${sepChar}${path}${queryString}`;
}

function addPutPostBody(path) {
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
    const keys = Object.getOwnPropertyNames(body);
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

function addGetParams(path) {
    return function (bodyObj, otherOptions = {}) {
        this.options = Object.assign(this.options, otherOptions);
        const queryString = encodeQueryString(bodyObj);
        return fetch(buildUrl(path, queryString), this.options);
    };
}

function POST(path) {
    const pseudoRequest = {
        options: {
            ...commonOpts(),
            method: 'POST',
        },
    };
    pseudoRequest.body = addPutPostBody(path).bind(pseudoRequest);
    return pseudoRequest;
}

function GET(path) {
    const pseudoRequest = {
        options: {
            ...commonOpts(),
            method: 'GET',
        },
    };
    pseudoRequest.params = addGetParams(path).bind(pseudoRequest);
    return pseudoRequest;
}

function PUT(path) {
    const pseudoRequest = {
        options: {
            ...commonOpts(),
            method: 'PUT',
        },
    };
    pseudoRequest.body = addPutPostBody(path).bind(pseudoRequest);
    return pseudoRequest;
}

const supportedMethods = ['GET', 'POST', 'PUT'];
export default function request(method, path) {
    const upperMethod = method.toUpperCase();
    if (!supportedMethods.includes(upperMethod)) {
        throw new Error(`${method} requests are not supported!`);
    }
    switch (upperMethod) {
    case 'POST':
        return POST(path);
    case 'GET':
        return GET(path);
    case 'PUT':
        return PUT(path);
    }
}
