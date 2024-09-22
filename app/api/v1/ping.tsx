import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: "pong"
  });
}

export { handler as GET, handler as POST };
