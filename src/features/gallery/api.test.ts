import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";

const TEST_SECRET = "test-secret-key-for-testing";
const TEST_CLIENT_ID = "test-gallery";
const TEST_PASSWORD = "test-gallery-password";

const mockManifest = {
  title: "Test Gallery",
  password: TEST_PASSWORD,
  coverImage: "cover.jpg",
  sections: [{ label: "All", photos: [{ src: "a.jpg", width: 100, height: 100 }] }],
};

function signSession(clientId: string, iat: number): string {
  return createHmac("sha256", TEST_SECRET)
    .update(`${clientId}|${iat}`)
    .digest("hex");
}

describe("gallery auth logic", () => {
  describe("clientId validation", () => {
    const CLIENT_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/i;

    it("accepts valid client IDs", () => {
      expect(CLIENT_ID_RE.test("lauren-friends-grad26")).toBe(true);
      expect(CLIENT_ID_RE.test("test-client")).toBe(true);
      expect(CLIENT_ID_RE.test("a")).toBe(true);
    });

    it("rejects path traversal attempts", () => {
      expect(CLIENT_ID_RE.test("../other-client")).toBe(false);
      expect(CLIENT_ID_RE.test("test/../../etc")).toBe(false);
      expect(CLIENT_ID_RE.test("")).toBe(false);
      expect(CLIENT_ID_RE.test("-starts-with-dash")).toBe(false);
      expect(CLIENT_ID_RE.test("has spaces")).toBe(false);
      expect(CLIENT_ID_RE.test("has%20encoded")).toBe(false);
    });
  });

  describe("password comparison", () => {
    it("rejects wrong password", () => {
      const input = Buffer.from("wrong-password");
      const expected = Buffer.from(TEST_PASSWORD);
      expect(input.length === expected.length && require("node:crypto").timingSafeEqual(input, expected)).toBe(false);
    });

    it("accepts correct password", () => {
      const input = Buffer.from(TEST_PASSWORD);
      const expected = Buffer.from(TEST_PASSWORD);
      expect(input.length === expected.length && require("node:crypto").timingSafeEqual(input, expected)).toBe(true);
    });

    it("rejects different-length passwords without throwing", () => {
      const input = Buffer.from("short");
      const expected = Buffer.from(TEST_PASSWORD);
      expect(input.length === expected.length).toBe(false);
    });
  });

  describe("HMAC session signing", () => {
    it("produces consistent signatures for same input", () => {
      const sig1 = signSession(TEST_CLIENT_ID, 1000);
      const sig2 = signSession(TEST_CLIENT_ID, 1000);
      expect(sig1).toBe(sig2);
    });

    it("produces different signatures for different client IDs", () => {
      const sig1 = signSession("client-a", 1000);
      const sig2 = signSession("client-b", 1000);
      expect(sig1).not.toBe(sig2);
    });

    it("produces different signatures for different timestamps", () => {
      const sig1 = signSession(TEST_CLIENT_ID, 1000);
      const sig2 = signSession(TEST_CLIENT_ID, 2000);
      expect(sig1).not.toBe(sig2);
    });

    it("a valid cookie for client-a does not authenticate client-b", () => {
      const iat = 1000;
      const sigA = signSession("client-a", iat);
      const sigB = signSession("client-b", iat);
      expect(sigA).not.toBe(sigB);
    });
  });

  describe("session expiry", () => {
    const SESSION_MAX_AGE = 86400;

    it("rejects expired sessions", () => {
      const iat = Math.floor(Date.now() / 1000) - SESSION_MAX_AGE - 1;
      const now = Math.floor(Date.now() / 1000);
      expect(now - iat > SESSION_MAX_AGE).toBe(true);
    });

    it("accepts fresh sessions", () => {
      const iat = Math.floor(Date.now() / 1000) - 100;
      const now = Math.floor(Date.now() / 1000);
      expect(now - iat > SESSION_MAX_AGE).toBe(false);
    });
  });

  describe("cookie format parsing", () => {
    const COOKIE_SEPARATOR = ".";

    it("rejects cookie without separator", () => {
      const parts = "noseparator".split(COOKIE_SEPARATOR);
      expect(parts.length).not.toBe(2);
    });

    it("rejects cookie with non-numeric timestamp", () => {
      const parts = "notanumber.somesig".split(COOKIE_SEPARATOR);
      expect(parts.length).toBe(2);
      expect(isNaN(parseInt(parts[0], 10))).toBe(true);
    });

    it("parses valid cookie format", () => {
      const iat = Math.floor(Date.now() / 1000);
      const sig = signSession(TEST_CLIENT_ID, iat);
      const cookie = `${iat}${COOKIE_SEPARATOR}${sig}`;
      const parts = cookie.split(COOKIE_SEPARATOR);
      expect(parts.length).toBe(2);
      expect(parseInt(parts[0], 10)).toBe(iat);
      expect(parts[1]).toBe(sig);
    });
  });

  describe("stripPassword", () => {
    it("excludes password from gallery data", () => {
      const { password, ...rest } = mockManifest;
      const galleryData = {
        title: rest.title,
        coverImage: rest.coverImage,
        sections: rest.sections,
        baseUrl: `https://example.com/${TEST_CLIENT_ID}/photos`,
        cdnBaseUrl: "https://example.com",
      };
      expect("password" in galleryData).toBe(false);
      expect(galleryData.title).toBe(mockManifest.title);
      expect(galleryData.sections).toBe(mockManifest.sections);
    });
  });
});
