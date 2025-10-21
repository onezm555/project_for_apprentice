const express = require("express");
const router = express.Router();
const noteController = require("../Controllers/noteController");

router.post("/", noteController.createNote);                   
router.get("/:userId", noteController.getNotes);               
router.get("/:userId/search", noteController.searchNotes);    
router.put("/:id", noteController.updateNote);                
router.delete("/:id", noteController.deleteNote);              
router.patch("/:id/pin", noteController.togglePin);            

module.exports = router;