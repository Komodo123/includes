import assert from "node:assert";
import { includes } from "./index.js";

assert(includes("google.com", "*") === true);
assert(includes("google.com", "google.com") === true);
assert(includes("google.com", ["amazon.com", "-google.com"]) === false);
assert(includes("google.com", ["*", "-google.com"]) === false);
assert(includes("google.com", ["-*", "google.com"]) === false);
assert(includes("*", ["amazon.com"]) === true);
assert(includes("*", ["-*", "google.com"]) === false);
assert(includes("*", "-*") === false);
assert(includes(["*"], []) === true);
assert(includes([], ["*"]) === true);
assert(includes("*", "amazon.com") === true);
assert(includes(["google.com", "amazon.com"], ["amazon.com"]) === false);
assert(includes(["google.com", "amazon.com"], "*") === true);
assert(
  includes(
    ["google.com", "amazon.com"],
    ["apple.com", "amazon.com", "google.com"]
  ) === true
);
assert(
  includes(
    ["google.com", "amazon.com"],
    ["apple.com", "amazon.com", "-google.com"]
  ) === false
);
assert(includes(/.*/, "google.com") === true);
assert(includes(/google/, ["google.com", "apple.com"]) === true);
assert(includes(/amazon/, ["google.com", "apple.com"]) === false);
assert(includes([/apple/, /amazon/], ["google.com", "apple.com"]) === false);
assert(includes("google.com", [/.*/]) === true);
assert(includes("google.com", /amazon/) === false);
assert(includes("google.com", [/google/, "-google.com"]) === false);
assert(includes("amazon.com", [/apple/, "-google.com", "*"]) === true);
assert(
  includes(
    ["amazon.com", "apple.com", "google.com"],
    [/apple/, "-google.com", "*"]
  ) === false
);
assert(includes("a*", ["-apple.com", "*"]) === false);
assert(includes("a*", ["apple.com", "amazon.com"]) === true);
assert(includes("ap*", ["apple.com", "google.com", "amazon.com"]) === true);
assert(includes("*o*", "google.com") === true);
assert(includes("goo*", "google.com") === true);
assert(includes("*le", "google.com") === false);
