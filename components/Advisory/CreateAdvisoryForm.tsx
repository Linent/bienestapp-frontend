import React, { useEffect, useState } from "react";
import { fetchUsers } from "@/services/userService";
import { fetchCareers } from "@/services/careerService";
import { createAdvisory } from "@/services/advisoryService";

const MAX_HOURS = 20;
const allowedTimes = [8, 9, 10, 11, 14, 15, 16, 17]; // Horarios permitidos
const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const AdvisoryForm = () => {
  const [advisors, setAdvisors] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{ day: string; hour: number } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const users = await fetchUsers();
      // Filtramos solo los asesores disponibles con menos de 20 horas asignadas
      const academicFriends = users.filter(user => user.role === "academic_friend" && user.enable && user.availableHours < MAX_HOURS);
      setAdvisors(academicFriends);
    };
    loadData();
  }, []);

  const handleAdvisorChange = (advisorId: string) => {
    setSelectedAdvisor(advisorId);
    const advisor = advisors.find(a => a._id === advisorId);
    if (advisor) {
      setSelectedCareer(advisor.career);
    }
  };

  const handleCellClick = (day: string, hour: number) => {
    setSelectedSchedule({ day, hour });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !selectedCareer || !selectedSchedule) return;

    const advisor = advisors.find(a => a._id === selectedAdvisor);
    if (!advisor || advisor.availableHours >= MAX_HOURS) {
      alert("Este asesor ya ha alcanzado el máximo de 20 horas.");
      return;
    }

    const dateStart = new Date();
    dateStart.setHours(selectedSchedule.hour, 0, 0, 0);

    const dateEnd = new Date(dateStart);
    dateEnd.setHours(dateStart.getHours() + 1);

    await createAdvisory({
      advisorId: selectedAdvisor,
      careerId: selectedCareer,
      day: selectedSchedule.day.toLowerCase(),
      dateStart,
      dateEnd,
      status: "pending",
      recurring: true,
    });

    alert("Asesoría creada exitosamente.");
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Registrar Asesoría</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Seleccionar Asesor:</label>
        <select className="w-full p-2 border rounded" onChange={(e) => handleAdvisorChange(e.target.value)}>
          <option value="">Selecciona un asesor</option>
          {advisors.map((advisor) => (
            <option key={advisor._id} value={advisor._id}>
              {advisor.name} ({advisor.availableHours} / 20 horas asignadas)
            </option>
          ))}
        </select>

        <label className="block mt-4 mb-2">Carrera del Asesor:</label>
        <input type="text" className="w-full p-2 border rounded bg-gray-100" value={selectedCareer} disabled />

        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Selecciona un horario:</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Hora</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allowedTimes.map((hour) => (
                <tr key={hour}>
                  <td className="border p-2 text-center">{`${hour}:00`}</td>
                  {daysOfWeek.map((day) => (
                    <td
                      key={`${day}-${hour}`}
                      className={`border p-2 text-center cursor-pointer ${
                        selectedSchedule?.day === day && selectedSchedule.hour === hour ? "bg-blue-300" : "hover:bg-blue-100"
                      }`}
                      onClick={() => handleCellClick(day, hour)}
                    >
                      {selectedSchedule?.day === day && selectedSchedule.hour === hour ? "✅" : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Crear Asesoría
        </button>
      </form>
    </div>
  );
};

export default AdvisoryForm;
