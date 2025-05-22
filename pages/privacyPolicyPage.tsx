import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody } from "@heroui/react";

export default function PoliticaDePrivacidadPage() {
  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto mt-10 px-4">
            <h2 className={title()}>Política de Privacidad</h2>

            <div className="prose prose-sm max-w-none text-justify text-gray-700">
              <h3 className="text-lg font-bold text-black mt-5">¿Quiénes somos?</h3>
              <p>
                Bienestapp es una aplicación creada por estudiantes de Ingeniería de Sistemas de la UFPS para facilitar la gestión de asesorías académicas y el acceso a los servicios de Bienestar Universitario.
              </p>

              <h3 className="text-lg font-bold text-black mt-5">¿Qué datos recopilamos?</h3>
              <ul className="list-disc ml-6">
                <li>Nombre completo y correo electrónico institucional</li>
                <li>Código de estudiante y programa académico</li>
                <li>Información de reservas, consultas y calificaciones</li>
                <li>Datos técnicos como dirección IP y tipo de dispositivo</li>
              </ul>

              <h3 className="text-lg font-bold text-black mt-5">¿Para qué usamos tu información?</h3>
              <ul className="list-disc ml-6">
                <li>Gestionar y programar asesorías académicas</li>
                <li>Contactarte para notificaciones y recordatorios</li>
                <li>Mejorar nuestros servicios y resolver problemas</li>
                <li>Cumplir obligaciones institucionales y legales</li>
              </ul>

              <h3 className="text-lg font-bold text-black mt-5">¿Con quién compartimos tu información?</h3>
              <p>
                Solo el equipo responsable del proyecto y los mentores académicos tienen acceso a tus datos para los fines mencionados. No compartimos ni vendemos tu información personal a terceros ajenos a la UFPS.
              </p>

              <h3 className="text-lg font-bold text-black mt-5">¿Cuánto tiempo guardamos tus datos?</h3>
              <p>
                Conservamos tu información mientras tengas una cuenta activa en Bienestapp. Puedes solicitar la eliminación de tus datos en cualquier momento.
              </p>

              <h3 className="text-lg font-bold text-black mt-5">¿Cómo protegemos tu información?</h3>
              <p>
                Aplicamos medidas de seguridad técnicas y administrativas para proteger tus datos. Acceso restringido y cifrado donde corresponde.
              </p>

              <h3 className="text-lg font-bold text-black mt-5">Tus derechos</h3>
              <ul className="list-disc ml-6">
                <li>Consultar, modificar o eliminar tu información personal</li>
                <li>Solicitar detalles sobre el uso de tus datos</li>
                <li>
                  Para ejercer estos derechos, contáctanos en: <a href="mailto:soporte@ufps.edu.co" className="text-primary font-medium">soporte@ufps.edu.co</a>
                </li>
              </ul>

              <h3 className="text-lg font-bold text-black mt-5">Cambios en la política</h3>
              <p>
                Podemos actualizar esta política. Te notificaremos sobre cambios importantes en esta página o por correo electrónico.
              </p>

              <h3 className="text-lg font-bold text-black mt-5">¿Tienes dudas?</h3>
              <p>
                Si tienes preguntas sobre tu privacidad, escríbenos a <a href="mailto:soporte@ufps.edu.co" className="text-primary font-medium">soporte@ufps.edu.co</a>.
              </p>

              <div className="text-xs text-gray-400 text-right mt-8">Última actualización: Mayo 2025</div>
            </div>
      </div>
    </DefaultLayout>
  );
}
