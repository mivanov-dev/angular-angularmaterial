import { NextFunction, Response, Request } from 'express';
import robotstxt from "generate-robotstxt";
// custom
import { handleErrors } from '../../middlewares';
import { config } from '../../config';

let robotsTxt;

class Controller {

    static robots = async (req: Request | any, res: Response, next: NextFunction) => {

        const { host, port } = config;

        res.header('content-type', 'text/plain');

        if (robotsTxt) {
            res.write(robotsTxt);
            res.end();
            return;
        }

        try {

            let content = await robotstxt({
                policy: [
                    {
                        userAgent: "*",
                        allow: "/",
                        disallow: "",
                    },
                ],
                sitemap: `http://${host}:${port}/sitemap.xml`,
                host: `http://${host}:${port}`,
            });

            robotsTxt = content;

            res.write(content);
            res.end();


        } catch (error) {
            handleErrors(error, res);
        }
    }

}

export { Controller as RobotsController };