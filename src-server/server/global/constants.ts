import PouchDB from "pouchdb";

export const ROOT_DIR = "/app/knowledge-base";
export const DB_DIR = `${ROOT_DIR}/data`;
export const FILE_DIR = `${ROOT_DIR}/file`;
export const TEMP_DIR = `${ROOT_DIR}/temp`;
export const PAYMENT_DIR = `${ROOT_DIR}/payment`;

export const GOOD_IDS_PATH = `${PAYMENT_DIR}/goodIds.json`;


export const db = new PouchDB("data", {
  prefix: ROOT_DIR + "/",
  auto_compaction: true,
});
