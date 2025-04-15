import React from "react";

import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader, Image } from "@heroui/react";

export default function IndexPage() {
  // Datos de cada tarjeta (puedes modificar el contenido aquí)
  const cardsData = [
    {
      title: "Asesoría Académica",
      subtitle: "Apoyo en tus materias",
      description: "Solicita ayuda en tus estudios con tutores especializados.",
      imageUrl:
        "https://ww2.ufps.edu.co/public/imagenes/seccion/b0530cd456a13c6b1612d7e2562a394e.jpg",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSfWzu9eG-6w8jBlO_Brq2cLQLn9AtRE8yMxY3d_I3eityc-Gg/viewform",
    },
    {
      title: "Bienestar Universitario",
      subtitle: "Siempre a tu lado",
      description:
        "Fortalecimiento de los servicios de Bienestar Universitario UFPS",
      imageUrl:
        "https://ww2.ufps.edu.co/public/imagenes/noticia/045d3494baa3138730f82cb3c4a29b94.jpg",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSd_SwnIMoj6Luro4hj2ep4BpJlDXhQDg_F75I4akxslR-TKZw/viewform",
    },
    {
      title: "La oficina virtual reiniciara",
      subtitle: "Estamos contigo en casa",
      description: "Vuelve la Oficina Virtual de Bienestar Universitario UFPS",
      imageUrl:
        "https://scontent.fbga2-1.fna.fbcdn.net/v/t1.6435-9/174627494_3709278305865154_4523148945106296178_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGWGS_v5Xe4qpB2Jp8yVJs_7TreAsdix6btOt4Cx2LHphuFQKUBWsW247CAjhV2A5o&_nc_ohc=0j7UldvLRZgQ7kNvwHl_MWa&_nc_oc=AdkTmXQKn8AgvIjgU0Ys-RjQZCLmN1rUkZseoFK-S7DeBsFIiIxfxqscJGxiOxr4H9kTR1jHHQTxO9essTlWCSxC&_nc_zt=23&_nc_ht=scontent.fbga2-1.fna&_nc_gid=kyjJlVD8DjXExE_xjltxXw&oh=00_AfF_i_5JqxoTGpOwFzXRoTBN-TwyQr5b8kx_WKtgGmLOtw&oe=681F9C65",
      href: "https://docs.google.com/forms/d/e/1FAIpQLSdKak7SIRrRkJpY6qGZifM4N3M4MQZDxvsUfAB7NFqqo6EMhA/viewform?fbclid=IwY2xjawJWx2xleHRuA2FlbQIxMAABHaQGDS6nXnCB52cbwJco3mp9WBmooacWSIKq-BN3GjMLzN1VTz2mLLllzg_aem__WChdfqJofJEOc1QqaYIsQ",
    },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold leading-tight">
            Bienvenido a Bienestapp
          </h1>
          <h2 className="mt-4 text-lg text-gray-700">
            Tu plataforma de bienestar estudiantil.
          </h2>
        </div>

        {/* Contenedor de las tarjetas con separación */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          {cardsData.map((card, index) => (
            <a
              key={index}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="py-4 w-5/6 h-85 mt-2">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold">
                    {card.subtitle}
                  </p>
                  <h4 className="font-bold text-large">{card.title}</h4>
                  <small className="text-default-500">{card.description}</small>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <Image
                    isZoomed
                    alt={card.title}
                    className="object-cover items-center rounded-xl"
                    src={card.imageUrl}
                    width={350}
                  />
                </CardBody>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
