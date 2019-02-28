export const FileStatus = Object.freeze({
  EMPTY: Symbol("empty"),
  WAITING: Symbol("waiting"),
  UPLOADING: Symbol("uploading"),
  DONE: Symbol("done")
});

export const UploaderStatus = Object.freeze({
  NO_FILES: Symbol("no_files"),
  FILE_LIST: Symbol("file_list"),
  UPLOADING: Symbol("uploading"),
  DONE: Symbol("done")
});

