const Event = require('../model/event');

// Create an event (protected endpoint)
exports.createEvent = async (req, res) => {
  const { name, date, capacity } = req.body;
  

  // Validate the incoming data
  if (!name || !date || !capacity) {
    return res.status(400).json({ message: 'Please provide all fields: name, date, capacity' });
  }

  try {
    const newEvent = new Event({
      name,
      date,
      capacity,
      availableSeats: capacity, // Initially, available seats are the same as capacity
      createdBy: req.user.id,
    });
    console.log("Request User:", req.user);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Get all events with optional filtering by date range and pagination
exports.getEvents = async (req, res) => {
  const { start, end, page = 1, limit = 10 } = req.query;
  
  // Build the query filters
  const filter = {};
  
  // Date range filter
  if (start && end) {
    filter.date = { $gte: new Date(start), $lte: new Date(end) };
  }

  try {
    const events = await Event.find(filter)
      .skip((page - 1) * limit)  // Pagination: Skip previous pages
      .limit(Number(limit))      // Limit the number of events per page
      .populate('createdBy', 'name email');  // Optionally populate creator details
    
    const totalEvents = await Event.countDocuments(filter);  // Get the total number of events matching the filter
    
    res.json({
      events,
      totalEvents,
      page,
      totalPages: Math.ceil(totalEvents / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Update an event’s details (protected endpoint)
exports.updateEvent = async (req, res) => {
  const { name, date, capacity } = req.body;
  const { id } = req.params;

  // Validate the event exists
  let event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Ensure the current user is the one who created the event
  if (event.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to update this event' });
  }

  // Update event details
  event.name = name || event.name;
  event.date = date || event.date;
  event.capacity = capacity || event.capacity;
  event.availableSeats = capacity || event.availableSeats;

  try {
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

// Delete an event (protected endpoint)
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  // Validate the event exists
  let event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Ensure the current user is the one who created the event
  if (event.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to delete this event' });
  }

  try {
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal Server error' });
  }
};
