import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  Calendar,
  Phone, // Import Phone icon
  Tag, // For equipment type
  Hash, // For serial number
  CheckCircle // For status
} from "lucide-react";
import type { PersonnelMember } from "@/hooks/usePersonnel";
import { useEquipmentByPersonnelId } from "@/hooks/useEquipment"; // Import the new hook

interface PersonnelProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: PersonnelMember | null;
}

export function PersonnelProfileModal({ isOpen, onClose, personnel }: PersonnelProfileModalProps) {
  if (!personnel) return null;

  const { assignedEquipment, isLoadingAssignedEquipment } = useEquipmentByPersonnelId(personnel.id);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "actif":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "formation":
        return <Badge className="bg-blue-100 text-blue-800">Formation</Badge>;
      case "congé":
        return <Badge className="bg-orange-100 text-orange-800">Congé</Badge>;
      case "indisponible":
        return <Badge className="bg-red-100 text-red-800">Indisponible</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getEquipmentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case "assigné":
        return <Badge className="bg-blue-100 text-blue-800">Assigné</Badge>;
      case "en maintenance":
        return <Badge className="bg-orange-100 text-orange-800">En maintenance</Badge>;
      case "hors service":
        return <Badge className="bg-red-100 text-red-800">Hors service</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile - {personnel.firstName} {personnel.lastName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">{personnel.firstName} {personnel.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <p className="font-medium">{personnel.grade}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{personnel.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Caserne</p>
                    <p className="font-medium">{personnel.caserne}</p>
                  </div>
                </div>

                {personnel.phone && ( // Display phone if available
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{personnel.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  {getStatusBadge(personnel.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EPI assignés */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">EPI assignés</h3>
            </CardHeader>
            <CardContent>
              {isLoadingAssignedEquipment ? (
                <p className="text-sm text-muted-foreground">Chargement des EPI...</p>
              ) : assignedEquipment.length > 0 ? (
                <div className="space-y-3">
                  {assignedEquipment.map((epi) => (
                    <div key={epi.id} className="flex items-center gap-3 p-2 border rounded-md">
                      <Shield className="w-5 h-5 text-primary" />
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium text-sm">{epi.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">S/N: {epi.serialNumber}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                          {getEquipmentStatusBadge(epi.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    0 équipement(s) assigné(s)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button onClick={() => window.open(`mailto:${personnel.email}`)}>
              <Mail className="w-4 h-4 mr-2" />
              Envoyer un email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
