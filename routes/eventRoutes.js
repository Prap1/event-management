const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controller/EventController');

// Protect these routes with JWT authentication

// POST /events: Create a new event
router.post('/', authMiddleware, createEvent);

// GET /events: Fetch all events (with optional filtering and pagination)
router.get('/', getEvents);

// PUT /events/:id: Update an event’s details
router.put('/:id', authMiddleware, updateEvent);

// DELETE /events/:id: Delete an event
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;
