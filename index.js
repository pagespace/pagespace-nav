'use strict';

var Promise = require('bluebird');

var findPagesPromise = null;

module.exports = {
    reset: function() {
        findPagesPromise = null;
    },
    process: function(data, opts) {
        opts = opts ||{};
        var preview = opts.preview;
        var PageModel = pagespace.getPageModel(preview);

        if(PageModel) {
            if (!findPagesPromise || !data.cache) {
                var filter = {
                    root: data.root || 'top',
                    status: 200,
                    useInNav: true
                };
                var query = PageModel.find(filter).sort({ order: 'asc'});
                findPagesPromise = Promise.promisify(query.exec, query);
            }
        } else {
            findPagesPromise = function() {
                return Promise.resolve([]);
            };
        }
        return findPagesPromise().then(function(pages) {

            pages.forEach(function(page) {
                page.active = opts.reqUrl.indexOf(page.url) > -1;
            });

            return {
                pages: pages,
                navListClass: data.navListClass || '',
                navListItemClass: data.navListItemClass || ''
            }
        });
    }
};