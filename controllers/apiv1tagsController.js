'use strict';

const varapiv1tagsController = require('./apiv1tagsControllerService');

// GET.
module.exports.getTags = function getTags (req, res, next) {
  varapiv1tagsController.getTags(req, res, next);
};

// POST. 
module.exports.modifyTags = function modifyTags (req, res, next) {
  varapiv1tagsController.modifyTags(req.swagger.params, res, next);
};

