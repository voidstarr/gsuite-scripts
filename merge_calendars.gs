function merge_calendars() {
  // blocks time slots on one calendar based on blocked slots of another
  Logger.log("for support, contact <>");
  
  var internal_cal_id = "<>"; // todo get calendar id
  var cal_to_import_from_id = "<>"; // adjust for imported calendar
  
  Logger.log("running merge from %s to %s", cal_to_import_from_id, internal_cal_id);
  
  var internal_cal = CalendarApp.getCalendarById(internal_cal_id);
  var cal_to_import_from = CalendarApp.getCalendarById(cal_to_import_from_id);
  
  var days_in_future = 31; // number of days in future to search
  var dateToSearch = new Date();
  
  for (var i = 0; i < days_in_future; i++) {
    // search external calendar for busy slots
    cal_to_import_from.getEventsForDay(dateToSearch).forEach((busy_ev) => {
      Logger.log("busy from %s to %s", busy_ev.getStartTime(), busy_ev.getEndTime());
      // does an event already exist in LC?
      if (internal_cal.getEvents(busy_ev.getStartTime(), busy_ev.getEndTime()).length == 0){
        // if not, slot in "Unavailable"
        var created_unavailable_ev = lc_cal.createEvent("Unavailable", busy_ev.getStartTime(), busy_ev.getEndTime());
        if (created_unavailable_ev) {
          Logger.log("added \"Unavailable\" from %s to %s", created_unavailable_ev.getStartTime(), created_unavailable_ev.getEndTime());
        } else {
          Logger.log("failed to add \"Unavailable\" from %s to %s", busy_ev.getStartTime(), busy_ev.getEndTime());
        }
      }
    });
  
    // search LC for Unavailable
    internal_cal.getEventsForDay(dateToSearch, {search: 'Unavailable'}).forEach((unavailable_ev) => {
    Logger.log("Unavailable from %s to %s", unavailable_ev.getStartTime(), unavailable_ev.getEndTime());
    // does an event exist in external cal?
      if (cal_to_import_from.getEvents(unavailable_ev.getStartTime(), unavailable_ev.getEndTime()).length == 0){
        Logger.log("Removing Unavailable from %s to %s", unavailable_ev.getStartTime(), unavailable_ev.getEndTime());
        // remove "Unavailable" if not
        unavailable_ev.deleteEvent();
      }
    });

    dateToSearch = new Date(dateToSearch.getTime() + 86400000);
  }
}
