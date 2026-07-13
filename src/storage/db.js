import { openDB } from "idb";

const DB_NAME = "RNAQualityDB";
const DB_VERSION = 1;

export function getDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("experiments")) {
                db.createObjectStore("experiments", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("samples")) {
                db.createObjectStore("samples", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("settings")) {
                db.createObjectStore("settings");
            }
        }
    });
}