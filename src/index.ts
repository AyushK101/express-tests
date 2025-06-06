import express, { Request, Response } from "express";
import { z } from "zod";
import { prismaClient } from "./db";
// import { prismaClient } from "./db";

export const app = express();
app.use(express.json());

const sumInput = z.object({
    a: z.number(),
    b: z.number()
})

// console.log(prismaClient);

//@ts-ignore
app.post("/sum",  async (req: Request,  res: Response) => {
    const parsedResponse = sumInput.safeParse(req.body)
    // console.log(this)
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

  const { a, b } = parsedResponse.data;
  const answer = a + b;
    const response = await prismaClient.sum.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: answer
        }
    })
    // console.log({response})
    res.status(200).json({
        answer,
        id: response.id
    })
});

//@ts-ignore
app.get("/sum", async (req, res) => {
    const parsedResponse = sumInput.safeParse({
        a: Number(req.headers["a"]),
        b: Number(req.headers["b"])
    })
    
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }


    const answer = parsedResponse.data.a + parsedResponse.data.b;

    const response = await prismaClient.sum.create({
        data: {
            a: parsedResponse.data.a,
            b: parsedResponse.data.b,
            result: answer
        }
    })
    console.log(response)
    res.json({
        answer,
        id: response.id
    })
});
