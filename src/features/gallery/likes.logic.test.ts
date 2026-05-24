import { describe, it, expect } from "vitest";
import { normalizeGuestName, rowsToLikes, validatePhotoSrc } from "./likes.logic";

describe("normalizeGuestName", () => {
  it("trims surrounding whitespace", () => {
    expect(normalizeGuestName("  Alice  ")).toBe("Alice");
  });

  it("accepts names with spaces and accents", () => {
    expect(normalizeGuestName("José García")).toBe("José García");
  });

  it("rejects empty or whitespace-only names", () => {
    expect(() => normalizeGuestName("")).toThrow();
    expect(() => normalizeGuestName("   ")).toThrow();
  });

  it("rejects names longer than 80 chars", () => {
    expect(() => normalizeGuestName("a".repeat(81))).toThrow();
  });
});

describe("validatePhotoSrc", () => {
  it("accepts a normal relative path", () => {
    expect(() => validatePhotoSrc("wedding/dsc0001.jpg")).not.toThrow();
  });

  it("rejects empty, overlong, or traversal paths", () => {
    expect(() => validatePhotoSrc("")).toThrow();
    expect(() => validatePhotoSrc("a".repeat(513))).toThrow();
    expect(() => validatePhotoSrc("../../etc/passwd")).toThrow();
  });
});

describe("rowsToLikes", () => {
  it("groups guest names by photo src", () => {
    const rows = [
      { photoSrc: "a.jpg", guestName: "Alice" },
      { photoSrc: "a.jpg", guestName: "Bob" },
      { photoSrc: "b.jpg", guestName: "Alice" },
    ];
    expect(rowsToLikes(rows)).toEqual({
      "a.jpg": ["Alice", "Bob"],
      "b.jpg": ["Alice"],
    });
  });

  it("returns an empty map for no rows", () => {
    expect(rowsToLikes([])).toEqual({});
  });
});
