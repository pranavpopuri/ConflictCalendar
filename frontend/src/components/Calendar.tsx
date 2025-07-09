import { useMemo, useState } from 'react'
import { Calendar as BigCalendar, momentLocalizer, Views, type View } from 'react-big-calendar'
import moment from 'moment'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCourseStore } from "../store/course"
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const Calendar = () => {
  const { courses, getConflictingCourses } = useCourseStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<View>(Views.WORK_WEEK)

  const conflictingCourseIds = getConflictingCourses()

  // Convert courses to calendar events
  const events = useMemo(() => {
    const calendarEvents: any[] = []

    courses.forEach(course => {
      course.days.forEach(day => {
        // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
        const dayMap: { [key: string]: number } = {
          'Sunday': 0,
          'Monday': 1,
          'Tuesday': 2,
          'Wednesday': 3,
          'Thursday': 4,
          'Friday': 5,
          'Saturday': 6
        }

        const dayNumber = dayMap[day]
        if (dayNumber === undefined) return

        // Get the current week's date for this day
        const startOfWeek = moment(currentDate).startOf('week')
        const eventDate = startOfWeek.clone().add(dayNumber, 'days')

        // Convert minutes to hours and minutes
        const startHours = Math.floor(course.startTime / 60)
        const startMinutes = course.startTime % 60
        const endHours = Math.floor(course.endTime / 60)
        const endMinutes = course.endTime % 60

        const startTime = eventDate.clone().set({
          hour: startHours,
          minute: startMinutes,
          second: 0
        }).toDate()

        const endTime = eventDate.clone().set({
          hour: endHours,
          minute: endMinutes,
          second: 0
        }).toDate()

        calendarEvents.push({
          id: `${course._id}-${day}`,
          title: course.name,
          start: startTime,
          end: endTime,
          resource: course,
          hasConflict: conflictingCourseIds.includes(course._id)
        })
      })
    })

    return calendarEvents
  }, [courses, currentDate])

  // Custom toolbar component
  const CustomToolbar = ({ date, onNavigate }: any) => {
    return (
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg border"
           style={{ backgroundColor: "oklch(0.98 0.01 220)", borderColor: "oklch(0.9 0.02 220)" }}>
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('PREV')}
            className="flex items-center gap-1"
            style={{
              borderColor: "oklch(0.7 0.05 220)",
              color: "oklch(0.4 0.1 220)"
            }}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('TODAY')}
            style={{
              borderColor: "oklch(0.7 0.05 220)",
              color: "oklch(0.4 0.1 220)"
            }}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('NEXT')}
            className="flex items-center gap-1"
            style={{
              borderColor: "oklch(0.7 0.05 220)",
              color: "oklch(0.4 0.1 220)"
            }}
          >
            Next
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Date Display */}
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} style={{ color: "oklch(0.5 0.1 220)" }} />
          <h2 className="text-lg font-semibold" style={{ color: "oklch(0.3 0.15 220)" }}>
            {moment(date).format('MMMM YYYY')}
          </h2>
        </div>

        {/* View Selector */}
        <div className="flex items-center gap-2">
          <Clock size={16} style={{ color: "oklch(0.5 0.1 220)" }} />
          <span className="text-sm font-medium" style={{ color: "oklch(0.4 0.1 220)" }}>
            Work Week View
          </span>
        </div>
      </div>
    )
  }

  // Custom event component
  const EventComponent = ({ event }: any) => {
    return (
      <div
        className="h-full p-1 rounded text-xs font-medium overflow-hidden"
        style={{
          backgroundColor: event.hasConflict
            ? "oklch(0.6 0.15 0)" // Red for conflicts
            : "oklch(0.7 0.1 220)", // Blue for normal
          color: "white",
          border: event.hasConflict
            ? "1px solid oklch(0.5 0.2 0)"
            : "1px solid oklch(0.6 0.15 220)"
        }}
      >
        <div className="font-semibold">{event.title}</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "oklch(0.3 0.15 220)" }}>
          Course Schedule Calendar
        </h1>
        <p className="text-sm md:text-base" style={{ color: "oklch(0.5 0.08 220)" }}>
          View your courses in a weekly calendar format
        </p>
      </div>

      <div
        className="calendar-container rounded-lg border shadow-sm overflow-hidden"
        style={{
          backgroundColor: "oklch(0.99 0.005 220)",
          borderColor: "oklch(0.9 0.02 220)",
          minHeight: "600px"
        }}
      >
        <style>{`
          .rbc-calendar {
            font-family: inherit;
          }

          .rbc-header {
            background-color: oklch(0.95 0.02 220) !important;
            color: oklch(0.3 0.15 220) !important;
            border-bottom: 1px solid oklch(0.85 0.03 220) !important;
            padding: 12px 8px !important;
            font-weight: 600 !important;
            font-size: 14px !important;
          }

          .rbc-time-view .rbc-time-gutter .rbc-timeslot-group {
            border-bottom: 1px solid oklch(0.9 0.02 220) !important;
          }

          .rbc-time-view .rbc-time-content {
            border-left: 1px solid oklch(0.9 0.02 220) !important;
          }

          .rbc-time-view .rbc-time-content > * + * > * {
            border-left: 1px solid oklch(0.9 0.02 220) !important;
          }

          .rbc-timeslot-group {
            min-height: 60px !important;
          }

          .rbc-time-slot {
            color: oklch(0.6 0.05 220) !important;
            font-size: 12px !important;
          }

          .rbc-event {
            background-color: oklch(0.7 0.1 220) !important;
            border: 1px solid oklch(0.6 0.15 220) !important;
            color: white !important;
            border-radius: 4px !important;
            padding: 2px 4px !important;
          }

          .rbc-event:hover {
            background-color: oklch(0.6 0.15 220) !important;
          }

          .rbc-day-slot .rbc-time-slot {
            border-top: 1px solid oklch(0.95 0.01 220) !important;
          }

          .rbc-current-time-indicator {
            background-color: oklch(0.5 0.2 220) !important;
            height: 2px !important;
          }

          .rbc-today {
            background-color: oklch(0.98 0.01 220) !important;
          }
        `}</style>

        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={currentDate}
          onNavigate={setCurrentDate}
          views={[Views.WORK_WEEK]}
          defaultView={Views.WORK_WEEK}
          min={new Date(2024, 0, 1, 7, 0)} // 7 AM
          max={new Date(2024, 0, 1, 22, 0)} // 10 PM
          step={60} // 1 hour steps
          timeslots={1} // 1 slot per step
          components={{
            toolbar: CustomToolbar,
            event: EventComponent,
          }}
          formats={{
            timeGutterFormat: 'HH:mm',
            dayFormat: 'ddd M/D',
            eventTimeRangeFormat: ({ start, end }: any) =>
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
        />
      </div>
    </div>
  )
}

export default Calendar
