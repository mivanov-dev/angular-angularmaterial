import { Router } from 'express';
import { SitemapController } from './controllers';

const router = Router();

router.get('/sitemap.xml', SitemapController.sitemap);

export { router as sitemapRouter };
