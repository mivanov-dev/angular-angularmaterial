import { Response, Request } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import { createGzip } from 'zlib';
// custom
import { handleErrors } from '../../middlewares';
import { config } from '../../config';

let sitemap: Buffer;

class Controller {

  static sitemap = async (req: Request, res: Response): Promise<void> => {

    const { seoProtocol, seoHost, seoPort } = config;

    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap);
      return;
    }

    try {
      const smStream = new SitemapStream({
        hostname: `${seoProtocol}://${seoHost}:${seoPort}/`,
        xmlns: {
          image: false,
          news: false,
          video: false,
          xhtml: false
        }
      });
      const pipeline = smStream.pipe(createGzip());

      // pipe your entries or directly write them.
      smStream.write({ url: '/#/user/auth' });
      smStream.write({ url: '/#/user/forgot-password' });
      smStream.write({ url: '/#/page-not-found' });

      // cache the response
      streamToPromise(pipeline).then(sm => sitemap = sm);
      // make sure to attach a write stream such as streamToPromise before ending
      smStream.end();
      // stream write the response
      pipeline.pipe(res).on('error', (error: Error) => { throw error; });

    } catch (error) {
      handleErrors(error, res);
    }
  }
}

export { Controller as SitemapController };
