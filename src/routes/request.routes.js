const router  = require('express').Router();
const {isAuthenticated} = require('../helpers/authenticate');
const {
   sendrequest,
   getRequestsends,
   getRequestReceived,
   setacceptRequest,
   setDeleteRequest
  
} =  require('../controllers/request.controller');

router.get('/sendrequest/:id_received',sendrequest);
router.get('/myRequestsends',isAuthenticated,getRequestsends);
router.get('/myRequestReceived',isAuthenticated,getRequestReceived);
router.get('/myRequestReceived/Acept/:id', isAuthenticated,setacceptRequest);
router.get('/myRequestReceived/Decline/:id', isAuthenticated,setDeleteRequest);


module.exports = router;
