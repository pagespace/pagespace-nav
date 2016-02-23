'use strict';
module.exports = {
    process: function(config, opts) {
        opts = opts ||{};
        var preview = opts.preview;

        var PageModel = pagespace.getPageModel(preview);
        if(PageModel) {
            var filter = {
                status: { $gte: 200, $lte: 302 },
                useInNav: true
            };
            if(!config.root || config.root === 'top') {
                filter.root = 'top';
            } else {
                filter.parent = config.root;
            }
            var findPagesPromise = PageModel.find(filter).sort({ order: 'asc'}).exec();

            return findPagesPromise.then(function(pages) {
                pages = pages.map(function(page) {
                    page.active = opts.reqUrl.indexOf(page.url) > -1;
                    return page;
                });

                return {
                    pages: pages,
                    navListClass: config.navListClass || '',
                    navListItemClass: config.navListItemClass || ''
                }
            }).then(undefined, function(err) {
                pagespace.logger.error(err);
                throw err;
            });
        } else {
            throw new Error('Could not get Page Model');
        }
    }
};