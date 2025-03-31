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
      imageUrl: "https://ww2.ufps.edu.co/public/imagenes/seccion/b0530cd456a13c6b1612d7e2562a394e.jpg",
      href:"https://docs.google.com/forms/d/e/1FAIpQLSfWzu9eG-6w8jBlO_Brq2cLQLn9AtRE8yMxY3d_I3eityc-Gg/viewform"
    },
    {
      title: "Bienestar Universitario",
      subtitle: "Siempre a tu lado",
      description: "Fortalecimiento de los servicios de Bienestar Universitario UFPS",
      imageUrl: "https://scontent.fbga2-1.fna.fbcdn.net/v/t39.30808-6/442477187_939805018151184_3692111653218029846_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE4IDfH_n-34jDbZoreU7GUnpaKs8wa46-eloqzzBrjr6U6jgRjTJ90iOCKfEoaOoc&_nc_ohc=MbQcSx7qnMIQ7kNvgG9ET60&_nc_oc=AdkHXEEE-fsSUXPyVgNl4L7F1s9FvYP1xxaKsox6cLd4KLKqSUl4ne_1OmZZaoeMyqqRNSI7cJGbxwpB2pwcKsat&_nc_zt=23&_nc_ht=scontent.fbga2-1.fna&_nc_gid=fRAgs22SOVG0HHLL3ckTqw&oh=00_AYEnIge35x9bTnekWxQV72fs_3lEIMCFyLUClRDtEvVg5Q&oe=67EFCB39",
      href:"https://docs.google.com/forms/d/e/1FAIpQLSd_SwnIMoj6Luro4hj2ep4BpJlDXhQDg_F75I4akxslR-TKZw/viewform"
    },
    {
      title: "La oficina virtual reiniciara",
      subtitle: "Estamos contigo en casa",
      description: "Vuelve la Oficina Virtual de Bienestar Universitario UFPS",
      imageUrl: "https://scontent.fbga2-1.fna.fbcdn.net/v/t39.30808-6/469897119_8588105951315674_8473951230566303519_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEsgd0MjjszMhTLowgJrUsK2hQwSoZGRGfaFDBKhkZEZ-ZogTvldQ4vYxbvmroU2ng&_nc_ohc=IP8KKiUibtMQ7kNvgHbkfIY&_nc_oc=AdlKMk58cQX5uJ_XRu68YVLU8JUTYA61g2JaRL8Yf03oIqbIH2fgYD7OPIEIhcEAkFzmdPME0h-oha3ys8cTNJ6X&_nc_zt=23&_nc_ht=scontent.fbga2-1.fna&_nc_gid=AB6LcIXRBUBMUX-I07FjRA&oh=00_AYGhw3Q4GjadLKP6n9_NbuZuTwviSMm_8n4lLOl_EM2e5Q&oe=67EFD197",
      href:"https://docs.google.com/forms/d/e/1FAIpQLSdKak7SIRrRkJpY6qGZifM4N3M4MQZDxvsUfAB7NFqqo6EMhA/viewform?fbclid=IwY2xjawJWx2xleHRuA2FlbQIxMAABHaQGDS6nXnCB52cbwJco3mp9WBmooacWSIKq-BN3GjMLzN1VTz2mLLllzg_aem__WChdfqJofJEOc1QqaYIsQ"
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
            <a href={card.href} target="_blank" no-follow>
            <Card 
            key={index} className="py-4 w-5/6 h-85 mt-2">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">{card.subtitle}</p>
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

