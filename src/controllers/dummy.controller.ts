import {Request, Response} from 'express';

export default {
    dummy(req: Request, res: Response) {
        res.status(200).json({
            success: true,
            message: "success hit endpoint /dummy (testing)",
            data: "OK",
        })
    }
};