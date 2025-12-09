import { describe, it, expect } from "vitest";
import { calculateGrade } from "./gradeService";

describe("calculateGrade", () => {
  it("returns INVALID for invalid scores", () => {
    expect(calculateGrade(-1)).toBe("INVALID");
    expect(calculateGrade(101)).toBe("INVALID");
  });

  it("returns A for high scores", () => {
    expect(calculateGrade(85)).toBe("A");
    expect(calculateGrade(95)).toBe("A");
  });

  it("returns B for medium scores", () => {
    expect(calculateGrade(70)).toBe("B");
    expect(calculateGrade(80)).toBe("B");
  });

  it("returns C for low scores", () => {
    expect(calculateGrade(69)).toBe("C");
    expect(calculateGrade(50)).toBe("C");
  });

  // ====================
  // Tambahan: BOUNDARY TEST
  // ====================

  it("returns C at boundary 69", () => {
    expect(calculateGrade(69)).toBe("C");
  });

  it("returns B at boundary 70", () => {
    expect(calculateGrade(70)).toBe("B");
  });

  it("returns B at boundary 84", () => {
    expect(calculateGrade(84)).toBe("B");
  });

  it("returns A at boundary 85", () => {
    expect(calculateGrade(85)).toBe("A");
  });
});
