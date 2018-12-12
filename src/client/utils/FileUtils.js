export function hydrateFile(file) {
    const { last_modified, created, ...rest } = file;
    const lastModifiedDate = new Date(last_modified);
    const createdDate = new Date(created);
    return {
        last_modified: lastModifiedDate,
        created: createdDate,
        ...rest,
    };
}

export function hydrateFiles(files) {
    return files.map(file => hydrateFile(file));
}

export function lastModifiedSorter(file1, file2) {
    if (file1.last_modified >= file2.last_modified) return -1;
    return 1;
}
