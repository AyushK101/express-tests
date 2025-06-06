import { describe, test, it, expect, vi } from "vitest";
import request from "supertest";
import { app } from "../index";
import { prismaClient } from "../__mocks__/db";
// import { mockDeep } from "vitest-mock-extended";
// import { PrismaClient } from "@prisma/client";

vi.mock("../db.ts");

describe("POST /sum", () => {
  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });

  it("should return 200 and if a: 1 , b:2 -> c:3", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      answer: 3,
      type: "ans",
      a: 1,
      b: 2,
    });

    vi.spyOn(prismaClient.sum, "create");

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    }); 

    // spying on function calls
     expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        result: 1+2
      }
     })

    expect(res.status).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body.id).toBe(1);
  });
});

describe("GET /sum", () => {
  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).get("/sum").send();
    expect(res.statusCode).toBe(411);
  });
});

// describe("Prisma Mock", () => {
//   it("should return type-safe mock", () => {
//     const mock = mockDeep<PrismaClient>();
//     mock.user.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com' } as any);
//     expect(mock.user.findFirst).toBeDefined();
//   });
// });
