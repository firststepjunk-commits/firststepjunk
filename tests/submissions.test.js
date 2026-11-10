import test from "node:test";
import assert from "node:assert/strict";
import { buildSubmissionRecord } from "../src/lib/submissions.js";

test("buildSubmissionRecord adds a timestamp and normalizes the photo payload", () => {
  const record = buildSubmissionRecord({
    name: "Taylor",
    phone: "555-0100",
    email: "taylor@example.com",
    junkDescription: "Couch, desk, and boxes",
    pestTreatment: "yes",
    homeRepair: "no",
    photos: [{ name: "couch.jpg", url: "https://drive.google.com/uc?id=abc" }],
  });

  assert.equal(record.name, "Taylor");
  assert.equal(record.status, "new");
  assert.equal(record.photos[0].name, "couch.jpg");
  assert.equal(record.photos[0].url, "https://drive.google.com/uc?id=abc");
  assert.equal(record.photos[0].ascii, undefined);
  assert.match(record.createdAt, /T/);
});
