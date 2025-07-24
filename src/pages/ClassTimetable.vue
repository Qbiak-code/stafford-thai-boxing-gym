<template>
  <div class="w-75 h-50 ma-auto">
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>

<script setup lang="ts">
import { ScheduleXCalendar } from "@schedule-x/vue"
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid,
} from "@schedule-x/calendar"
import "@schedule-x/theme-default/dist/index.css"
import { createIcalendarPlugin } from "@schedule-x/ical"

const icalendarPlugin = createIcalendarPlugin({
  data:
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    "BEGIN:VEVENT\n" +
    "SUMMARY:Good morning\n" +
    "DTSTART;TZID=America/New_York:20240801T103400\n" +
    "DTEND;TZID=America/New_York:20240801T110400\n" +
    "LOCATION:1000 Broadway Ave.\\, Brooklyn\n" +
    "DESCRIPTION: Access-A-Ride trip to 900 Jay St.\\, Brooklyn\n" +
    "STATUS:CONFIRMED\n" +
    "SEQUENCE:3\n" +
    "END:VEVENT\n" +
    "BEGIN:VEVENT\n" +
    "RRULE:FREQ=DAILY;COUNT=3\n" +
    "SUMMARY:Good night\n" +
    "DTSTART;TZID=America/New_York:20240902T200000\n" +
    "DTEND;TZID=America/New_York:20240902T203000\n" +
    "LOCATION:900 Jay St.\\, Brooklyn\n" +
    "DESCRIPTION: Access-A-Ride trip to 1000 Broadway Ave.\\, Brooklyn\n" +
    "STATUS:CONFIRMED\n" +
    "SEQUENCE:3\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR",
})

const config = {
  /**
   * The preferred view to display when the calendar is first rendered.
   * all views that you import have a "name" property, which helps you identify them.
   * Defaults to the first view in the "views" array
   * */
  defaultView: viewMonthGrid.name,
  isDark: true,

  /**
   * Decides which hours should be displayed in the week and day grids. Only full hours are allowed; 01:30, for example, is not allowed.
   * Defaults to midnight - midnight (a full day)
   * Can also be set to a "hybrid" day, such as { start: '06:00', end: '03:00' }, meaning each day starts at 6am but
   * extends into the next day until 3am.
   * */
  dayBoundaries: {
    start: "08:00",
    end: "21:00",
  },

  weekOptions: {
    /**
     * The total height in px of the week grid (week- and day views)
     * */
    gridHeight: 800,
  },

  /**
   * Callbacks for events that occur in the calendar
   * */
  callbacks: {
    onRangeUpdate(range) {
      console.log("rendering events for new range", range)
      icalendarPlugin.between(range.start, range.end)
    },
  },
  /*callbacks: {
    /!**
     * Is called when:
     * 1. Selecting a date in the date picker
     * 2. Selecting a new view
     * *!/
    onRangeUpdate(range) {
      console.log('new calendar range start date', range.start)
      console.log('new calendar range end date', range.end)
    },

    /!**
     * Is called when an event is updated through drag and drop, resizing or the interactive event modal
     * *!/
    onEventUpdate(updatedEvent) {
      console.log('onEventUpdate', updatedEvent)
    },

    /!**
     * Is called when an event is clicked
     * *!/
    onEventClick(calendarEvent, e: UIEvent) {
      console.log('onEventClick', calendarEvent)
    },

    /!**
     * Is called when clicking a date in the month grid
     * *!/
    onClickDate(date, e?: UIEvent) {
      console.log('onClickDate', date) // e.g. 2024-01-01
    },

    /!**
     * Is called when clicking somewhere in the time grid of a week or day view
     * *!/
    onClickDateTime(dateTime, e?: UIEvent) {
      console.log('onClickDateTime', dateTime) // e.g. 2024-01-01 12:37
    },

    /!**
     * Is called when selecting a day in the month agenda
     * *!/
    onClickAgendaDate(date, e?: UIEvent) {
      console.log('onClickAgendaDate', date) // e.g. 2024-01-01
    },

    /!**
     * Is called when double-clicking a day in the month agenda
     * *!/
    onDoubleClickAgendaDate(date, e?: UIEvent) {
      console.log('onDoubleClickAgendaDate', date) // e.g. 2024-01-01
    },

    /!**
     * Is called when double-clicking a date in the month grid
     * *!/
    onDoubleClickDate(date, e?: UIEvent) {
      console.log('onClickDate', date) // e.g. 2024-01-01
    },

    /!**
     * Is called when double-clicking somewhere in the time grid of a week or day view
     * *!/
    onDoubleClickDateTime(dateTime, e?: UIEvent) {
      console.log('onDoubleClickDateTime', dateTime) // e.g. 2024-01-01 12:37
    },

    /!**
     * Is called when clicking the "+ N events" button of a month grid-day
     * *!/
    onClickPlusEvents(date, e?: UIEvent) {
      console.log('onClickPlusEvents', date) // e.g. 2024-01-01
    },

    /!**
     * Is called when the selected date is updated
     * *!/
    onSelectedDateUpdate(date) {
      console.log('onSelectedDateUpdate', date)
    },

    /!**
     * Runs on resizing the calendar, to decide if the calendar should be small or not.
     * This in turn affects what views are rendered.
     * *!/
    isCalendarSmall($app) {
      return $app.elements.calendarWrapper?.clientWidth! < 500
    },

    /!**
     * Runs before the calendar is rendered
     * *!/
    beforeRender($app) {
      const range = $app.calendarState.range.value
      fetchYourEventsFor(range.start, range.end)
    },

    /!**
     * Runs after the calendar is rendered
     * *!/
    onRender($app) {
      console.log('onRender', $app)
    },
  },*/
  selectedDate: "2023-12-19",
  views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  events: [
    {
      id: 1,
      title: "Event 1",
      start: "2023-12-19",
      end: "2023-12-19",
    },
    {
      id: 2,
      title: "Event 2",
      start: "2023-12-20 12:00",
      end: "2023-12-20 13:00",
    },
  ],
}

const calendarApp = createCalendar(config, [icalendarPlugin])
</script>
