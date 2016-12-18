var $ = require('jquery');

module.exports = function replaceWithContent(/**jQuery | function():jQuery*/$node, /**String=*/selector) {

    function getNodes() {
        if (_.isFunction($node)) {
            return $node();
        } else {
            return $node.find(selector);
        }
    }

    var $nodes = getNodes();

    while ($nodes.length > 0) {
        $($nodes[0]).replaceWith(function () {
            return $(this).html();
        });
        $nodes = getNodes();
    }
};

