import { NextFunction, Response, Request } from 'express';
// @ts-ignore
import robotstxt from 'generate-robotstxt';
// custom
import { handleErrors } from '@server/middlewares';
import { config } from '@server/config';

let robotsTxt: any;

class Controller {

  static robots = async (req: Request | any, res: Response, next: NextFunction): Promise<void> => {

    const { seoProtocol, seoHost, seoPort } = config;

    res.header('content-type', 'text/plain');

    if (robotsTxt) {
      res.write(robotsTxt);
      return res.end();
    }

    try {

      const content = await robotstxt({
        policy: [
          {
            userAgent: '*',
            disallow: '',
          },
        ],
        sitemap: `${seoProtocol}://${seoHost}:${seoPort}/sitemap.xml`,
        host: `${seoProtocol}://${seoHost}:${seoPort}`,
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
