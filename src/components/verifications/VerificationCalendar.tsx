import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useVerifications } from "@/hooks/useVerifications";
import { Dialog } from "@/components/ui/dialog";
import { ScheduleVerificationForm } from "@/components/forms/ScheduleVerificationForm";
import { EditVerificationForm } from "@/components/forms/EditVerificationForm"; // Corrected import
import { VerificationActions } from "./VerificationActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import type { Verification } from "@/hooks/useVerifications";

moment.locale("fr");
const localizer = momentLocalizer(moment);

interface VerificationCalendarProps {
  onCompleteVerification: (verification: Verification) => void;
}

export function VerificationCalendar({ onCompleteVerification }: VerificationCalendarProps) {
  const { verifications, isLoading, error } = useVerifications();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  const events = verifications.map((v) => ({
    id: v.id,
    title: `${v.equipmentName} - ${v.assignedTo}`,
    start: new Date(v.scheduledDate),
    end: new Date(v.scheduledDate),
    allDay: true,
    resource: v, // Store the full verification object
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedVerification(event.resource);
    setIsUpdateModalOpen(true);
  };

  const handleScheduleSubmit = () => {
    setIsScheduleModalOpen(false);
  };

  const handleUpdateSubmit = () => {
    setIsUpdateModalOpen(false);
    setSelectedVerification(null);
  };

  const handleEditVerification = (verification: Verification) => {
    setSelectedVerification(verification);
    setIsUpdateModalOpen(true);
  };

  const eventPropGetter = (event: any) => {
    let className = "";
    switch (event.resource.status) {
      case "Planifié":
        className = "bg-blue-500 text-white";
        break;
      case "En attente":
        className = "bg-yellow-500 text-white";
        break;
      case "Terminé":
        className = "bg-green-500 text-white";
        break;
      case "Annulé":
        className = "bg-red-500 text-white";
        break;
      default:
        className = "bg-gray-500 text-white";
        break;
    }
    return { className };
  };

  const EventComponent = ({ event }: { event: any }) => (
    <div className="flex justify-between items-center p-1">
      <span className="font-medium text-sm">{event.title}</span>
      <VerificationActions 
        verification={event.resource} 
        onEdit={handleEditVerification} 
        onComplete={onCompleteVerification} // Pass onCompleteVerification prop
      />
    </div>
  );

  if (isLoading) return <div>Chargement des vérifications...</div>;
  if (error) return <div>Erreur lors du chargement des vérifications: {error.message}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Calendrier des vérifications
        </CardTitle>
        <Button onClick={() => setIsScheduleModalOpen(true)} className="rescue-gradient text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Planifier une vérification
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            messages={{
              next: "Suivant",
              previous: "Précédent",
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Agenda",
              date: "Date",
              time: "Heure",
              event: "Événement",
              noEventsInRange: "Aucun événement dans cette période.",
              showMore: (total) => `+ Voir ${total} de plus`,
            }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            components={{
              event: EventComponent,
            }}
          />
        </div>
      </CardContent>

      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <ScheduleVerificationForm onSubmit={handleScheduleSubmit} onCancel={() => setIsScheduleModalOpen(false)} />
      </Dialog>

      {selectedVerification && (
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
          <EditVerificationForm // Corrected component name
            verification={selectedVerification}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setIsUpdateModalOpen(false)}
          />
        </Dialog>
      )}
    </Card>
  );
}
